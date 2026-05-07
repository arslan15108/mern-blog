import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        index: true // index to enable search by username faster 
    },
     email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
    },
     fullName: {
        type: String,
        required: true,
        trim: true,
        index: true // index to enable search by fullName faster
    },
    avatar: {
        type: String, //Cloudinary url of the avatar image
        required: true,
    },
    coverImage: {
        type: String, //Cloudinary url of the avatar image
    },

    watchHistory: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Video"
        }
    ],
    password: {
        type: String,
        required: [true, "Password is required"],
    },
    refreshToken: {
        type: String,
    }
    
}, { timestamps: true });

// Use setter to hash password automatically when set
// userSchema.path("password").set(function(value) {
//     console.log("Password setter called with:", value ? "value provided" : "no value");
//     // Always hash the password when set
//     const salt = bcrypt.genSaltSync(10);
//     const hashed = bcrypt.hashSync(value, salt);
//     console.log("Password hashed:", hashed.substring(0, 20) + "...");
//     return hashed;
// });

userSchema.pre("save", async function () {
    if (!this.isModified("password")) return;
    this.password = await bcrypt.hash(this.password, 10);
});

userSchema.methods.comparePassword = async function (password) {
    return await bcrypt.compare(password, this.password);
}

userSchema.methods.generateAccessToken = function () {
    return jwt.sign({
        _id: this._id,
        email: this.email,
        username: this.username,
        fullName: this.fullName,
    }, 
    process.env.ACCESS_TOKEN_SECRET, 
    { 
        expiresIn: process.env.ACCESS_TOKEN_EXPIRY
    }
)
}

userSchema.methods.generateRefreshToken = function () {
    return jwt.sign(
        {
            _id: this._id,
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY
        }
    )
}

export const User = mongoose.model("User", userSchema);