import { ApiResponse } from '../utils/ApiResponse.js';
import {asyncHandler} from '../utils/asyncHandler.js';
import { User } from '../models/user.models.js';
import { uploadToCloudinary } from '../utils/Cloudinary.js';
import { ApiError } from '../utils/ApiError.js';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';

const generateTokens = async (userId) => {
    try {
       const user = await User.findById(userId);
        const accessToken = user.generateAccessToken();
        const refreshToken = user.generateRefreshToken();

        user.refreshToken = refreshToken;
        await user.save({validateBeforeSave: false});
        return { accessToken, refreshToken };

    }catch (error) {
        console.error("Error generating tokens:", error);
        return null;
    }
}
const registerUser = asyncHandler( async (req,res) => {
    const {fullName,username,email,password} = req.body;
    
    if([fullName,username,email,password].some(field => field?.trim() === "")) {
        throw new ApiError(400, "All fields are required");
    }

    const existedUser = await User.findOne({
        $or: [
            {email},
            {username}
        ]
    })

    if(existedUser) {
        throw new ApiError(400, "User with this email or username already exists");
    }

    const avatarLocalPath = req.files?.avatar?.[0]?.path;
    
    const coverImageLocalPath = req.files?.coverImage?.[0]?.path || null;

    if(!avatarLocalPath) {
        throw new ApiError(400, "Avatar is required");
    }
    
    const avatar = await uploadToCloudinary(avatarLocalPath);
    const coverImage = coverImageLocalPath ? await uploadToCloudinary(coverImageLocalPath) : null;

    

    if(!avatar) {
        throw new ApiError(500, "Error uploading images to Cloudinary");
    }

    // Password will be hashed by pre-save hook in model
    const user = await User.create({
        fullName,
        avatar: avatar?.url,
        coverImage: coverImage?.url || "",
        username: username.toLowerCase(),
        email,
        password
    })

    const userCreation = await User.findById(user._id).select(
        "-password -__v -createdAt -updatedAt -refreshToken"
    )

    if(!userCreation) {
        throw new ApiError(500, "Something went wrong while creating user");
    }

    return res.status(201).json(
        new ApiResponse(201, "User created successfully", userCreation)
    )

})

const loginUser = asyncHandler (async (req,res) => {
    // req body -> data
    // username or email
    // check if user exist with given username or email
    // password check 
    // generate access token and refresh token
    // send cookie 
    const {username,email,password} = req.body;

    if(!(username || email)) {
        throw new ApiError(400, "Username or email is required");
    }
    if(!password) {
        throw new ApiError(400, "Password is required");
    }

    const user = await User.findOne({
        $or: [
            {username}, {email}
        ]
    })

    if(!user) {
        throw new ApiError(404, "User not found with given email or username");
    }

   const isValidPassword = await user.comparePassword(password);
   

   if(!isValidPassword) {

    throw new ApiError(401, "Invalid password");
   }
   
   const {accessToken,refreshToken} = await generateTokens(user._id);

   const loggedInUser = await User.findById(user._id).select(
    "-password -__v -createdAt -updatedAt -refreshToken"
   )
   const options = {
    httpOnly: true,
    secure: true,
   }

   return res.status(200)
   .cookie("accessToken",accessToken, options)
   .cookie("refreshToken",refreshToken, options)
   .json(
    new ApiResponse(200, 
        "User logged in successfully", 
        {
            user: loggedInUser, accessToken, refreshToken
        }
    )
   )

})

const logoutUser = asyncHandler (async (req,res) => {
    // clear cookie
    // reset refresh token in db
    await User.findByIdAndUpdate(req.user._id, {
        $set: {
            refreshToken: null
        }
    },
    {new: true}
)

    const options = {
        httpOnly: true,
        secure: true,
    }

    return res.status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(
        new ApiResponse(200, "User logged out successfully")
    )
    
})

const getCurrentUser = asyncHandler (async (req, res) => {
    const currentUserToken = req.cookies?.refreshToken || req.body?.refreshToken;
    
        if(!currentUserToken) {
            throw new ApiError(401, "unauthorized, refresh token is missing");
        }
    try{
         const decodedToken = jwt.verify(currentUserToken, process.env.REFRESH_TOKEN_SECRET);
        const user = await User.findById(decodedToken?._id);
        
        if(!user){
            throw new ApiError(401, "Invalid refresh token, user not found");
        }
        if(currentUserToken !== user.refreshToken) {
            throw new ApiError(401, "Refresh token is expired or invalid");
        }
        const loggedInUser = await User.findById(user._id).select(
            "-password -__v -createdAt -updatedAt -refreshToken"
        )
        return res
        .status(200)
        .json(new ApiResponse(200, "User Fetched Successfully!", loggedInUser));
    }
    catch(error) {
        throw new ApiError(401,error.message || "Token Expired Please LoggedIn Again!")
    }

})

const refreshAccessToken = asyncHandler (async (req,res) => {
    const incomingRefreshToken = req.cookies?.refreshToken || req.body?.refreshToken;
    if(!incomingRefreshToken) {
        throw new ApiError(401, "unauthorized, refresh token is missing");
    }
   try{
         const decodedToken = jwt.verify(incomingRefreshToken, process.env.REFRESH_TOKEN_SECRET);
    const user = await User.findById(decodedToken?._id);
    if(!user){
        throw new ApiError(401, "Invalid refresh token, user not found");
    }
    if(incomingRefreshToken !== user.refreshToken) {
        throw new ApiError(401, "Refresh token is expired or invalid");
    }
    const options = {
        httpOnly: true,
        secure: true,
    }
     const {accessToken, newRefreshToken} = await generateTokens(user._id);
     return res.status(200)
     .cookie("accessToken", accessToken, options)
     .cookie("refreshToken", newRefreshToken, options)
     .json(
        new ApiResponse(200, "Access token refreshed successfully", {accessToken, refreshToken: newRefreshToken})
     )
   } catch (error) {
    console.error("Error refreshing access token:", error);
    throw new ApiError(401, error.message || "Invalid or expired refresh token");
   }
})


const changeCurrentPassword = asyncHandler (async (req,res) => {
    const {oldPassword, newPassword} = req.body;
    
    const user = await User.findById(req.user._id);

    const isPasswordCorrect = user.comparePassword(oldPassword);

    if(!isPasswordCorrect) {
        throw new ApiError(401, "Old password is incorrect");
    }

    user.password = newPassword;
    await user.save({validateBeforeSave: false});

    return res.status(200)
    .json(new ApiResponse(200, "Passowrd changed successfully!", {}))
})

const updateAccountDetails = asyncHandler (async (req, res) => {
    const {fullName, email} = req.body;

    const user = User?.findByIdAndUpdate(
        req.user?._id, 
        {
            $set: {
                fullName,
                email
            }
        },
        {new: true}
    ).select("-password");
    
    return res 
    .status(200)
    .json(new ApiResponse(200, "Account details updated successfully!", user))
})

const updateAvatar = asyncHandler (async (req,res) => {
    const avatarLocalPath = req.file?.path;
    if (!avatarLocalPath) {
        throw new ApiError(400, "Avatar file is missing");
    }

    const avatar = await uploadToCloudinary(avatarLocalPath);

    if(!avatar?.url) {
        throw new ApiError(400, "Error while uploading avatar image on cloudinary!")
    }

    await User.findByIdAndUpdate(req.user?._id, {
        $set: {
            avatar: avatar?.url
        }
    },
    {new: true}
).select("-password")
    return res
    .status(200)
    .json(
        new ApiResponse(200,"Avatar image uploaded successfully!", user)
    )
});

const updateCoverImage = asyncHandler (async (req,res) => {
    const coverImageLocalPath = req.file?.path;
    if (!coverImageLocalPath) {
        throw new ApiError(400, "Cover file is missing");
    }

    const coverImage = await uploadToCloudinary(coverImageLocalPath);

    if(!coverImage?.url) {
        throw new ApiError(400, "Error while uploading cover image on cloudinary!")
    }

    const user = await User.findByIdAndUpdate(req.user?._id, {
        $set: {
            avatar: coverImage?.url
        }
    },
    {new: true}
).select("-password")

    return res
    .status(200)
    .json(
        new ApiResponse(200,"Cover image uploaded successfully!", user)
    )

})


export {
    registerUser, 
    loginUser, 
    logoutUser,
    changeCurrentPassword, 
    refreshAccessToken,
    updateAccountDetails,
    updateAvatar,
    updateCoverImage,
    getCurrentUser,
};