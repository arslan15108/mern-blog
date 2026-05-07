import { Blog } from "../models/blogs.models.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { uploadToCloudinary } from "../utils/Cloudinary.js";
import { User } from "../models/user.models.js"
import { asyncHandler } from "../utils/asyncHandler.js";
import slugify from "slugify";
import { Notification } from "../models/notification.models.js";
import {io, onlineUsers} from "../index.js";

const addBlog = asyncHandler(async (req, res) => {
  const { title, description, category, status } = req.body;

  if ([title || description || category].some(field => field?.trim() === "")) {
    throw new ApiError(401, "All fields are required!");
  }

  const existedBlog = await Blog.findOne({ title });

  if (existedBlog) {
    throw new ApiError(401, "Blog with this title already exists!")
  }

  const blogImageLocalPath = req?.files?.image?.[0]?.path;

  if (!blogImageLocalPath) {
    throw new ApiError(401, "Blog image is missing!");
  }

  const blogImage = await uploadToCloudinary(blogImageLocalPath);

  if (!blogImage) {
    throw new ApiError(401, "Error!, while uploading image to cloudinary.")
  }

  const postSlug = slugify(title, { lower: true });

  const blog = await Blog.create({
    title,
    description: description.toLowerCase(),
    category: category.toLowerCase(),
    image: blogImage?.url || "",
    owner: req?.user?._id,
    slug: postSlug,
    status: status || "published",
  })

  const blogCreation = await Blog.findById(blog?._id);

  if (!blogCreation) {
    throw new ApiError(401, "There is something wrong while adding new blog!");
  }

  return res.status(201)
    .json(
      new ApiResponse(201, "Blog Added Successfully!", blogCreation)
    )

})

// get published posts
const getPublishedPosts = asyncHandler(async (req, res) => {
  const posts = await Blog.find({ status: "published" })
    .sort({ createdAt: -1 })
    .populate("owner", "fullName username avatar");
  // console.log(posts, "posts");

  return res.status(200).json(
    new ApiResponse(200, "Posts fetched", posts)
  );
});

// get Recent Post
const getRecentPosts = asyncHandler(async (req, res) => {
  const limit = parseInt(req.query.limit) || 5;

  const posts = await Blog.aggregate([
    { $sort: { createdAt: -1 } },
    { $limit: limit },
    {
      $match: {
        status: "published"
      }
    },
    {
      $lookup: {
        from: "users",
        localField: "owner",
        foreignField: "_id",
        as: "owner",
      },
    },
    { $unwind: "$owner" },
    {
      $project: {
        title: 1,
        description: 1,
        slug: 1,
        category: 1,
        createdAt: 1,
        image: 1,
        status: 1,
        "owner.fullName": 1,
        "owner.username": 1,
        "owner.avatar": 1,
      },
    },
  ]);



  return res.status(200).json(
    new ApiResponse(200, "Recent posts fetched", posts)
  );
});
// get all posts with pagination
const getPosts = asyncHandler(async (req, res) => {
  const page = Math.max(parseInt(req.query.page) || 1, 1);
  const limit = Math.max(parseInt(req.query.limit) || 10, 1);
  const skip = (page - 1) * limit;

  const result = await Blog.aggregate([
    {$match: {status: "published"}},
    {
      $facet: {
        posts: [
          { $sort: { createdAt: -1 } },
          { $skip: skip },
          { $limit: limit },
          {
            $lookup: {
              from: "users",
              localField: "owner",
              foreignField: "_id",
              as: "owner",
            },
          },
          { $unwind: "$owner" },
          {
            $project: {
              title: 1,
              description: 1,
              category: 1,
              createdAt: 1,
              image: 1,
              status: 1,
              slug: 1,
              likes: 1,
              "owner.fullName": 1,
              "owner.username": 1,
              "owner.avatar": 1,
            },
          },
        ],
        categories: [
          {
            $group: {
              _id: "$category",
              count: {$sum: 1},
            }
          },
          {$sort: {count: -1} },
          {
            $project: {
              _id: 0,
              name: "$_id",
              count: 1,
            }
          }
        ],
        totalCount: [{ $count: "count" }],
      },
    },
  ]);

  const posts = result[0].posts;
  const categories = result[0].categories;   
  const totalPosts = result[0].totalCount[0]?.count || 0;

  return res.status(200).json(
    new ApiResponse(200, "Posts fetched successfully", {
      posts,
      categories,
      currentPage: page,
      totalPages: Math.ceil(totalPosts / limit),
      totalPosts,
    })
  );
});
// delete all posts
const deleteAllPosts = asyncHandler(async (req, res) => {
  const result = await Blog.deleteMany({});

  return res.status(200).json(
    new ApiResponse(200, "All Records Have Been Deleted Successfully!")
  );
})
//  single post
const postDetails = asyncHandler(async (req, res) => {
  const { slug } = req.params;
  const userId = req.user?._id; // ✅ get current user

  const singleBlog = await Blog.aggregate([
    { $match: { slug } },
    {
      $lookup: {
        from: "users",
        localField: "owner",
        foreignField: "_id",
        as: "owner"
      }
    },
    { $unwind: "$owner" },
    {
      $project: {
        title: 1,
        description: 1,
        slug: 1,
        image: 1,
        category: 1,
        createdAt: 1,
        likes: 1,
        likesCount: { $size: { $ifNull: ["$likes", []] } },//total likes
        isLiked: { $in: [userId, "$likes"] },//has user liked
        "owner.fullName": 1,
        "owner.username": 1,
        "owner.avatar": 1,
      }
    }
  ]);

  if (!singleBlog?.length) {                                      // ✅ aggregate returns array
    throw new ApiError(404, "Post Not Found!");
  }

  return res.status(200).json(
    new ApiResponse(200, "Selected post data fetched successfully!", singleBlog[0])
  );
});
// dashboard data
const dashboardData = asyncHandler(async (req, res) => {
  const limit = 10; // fixed to 10
  const user = req.user;

  const result = await Blog.aggregate([
    {
      $facet: {
        posts: [
          { $match: { owner: user._id } },
          { $sort: { createdAt: -1 } },
          { $limit: limit },
          {
            $project: {
              title: 1,
              status: 1,
              category: 1,
              createdAt: 1,
              likes: 1,
              likesCount: { $size: { $ifNull: ["$likes", []] } },
            },
          },
        ],
        totalPosts: [
          { $match: { owner: user._id } },
          { $count: "count" },
        ],
        totalLikes: [
          { $match: { status: "published" } },
          {
            $group: {
              _id: null,
              likesCount: { $sum: { $size: { $ifNull: ["$likes", []] } } },
            }
          }
        ]
      },
    },
  ]);

  const posts = result[0].posts;
  const totalPosts = result[0].totalPosts[0]?.count || 0;
  const totalLikes = result[0].totalLikes[0]?.likesCount || 0;

  return res.status(200).json(
    new ApiResponse(200, "Posts fetched successfully", {
      posts,
      totalPosts,
      totalLikes,

    })
  );
});

// toggle post like 
const toggleLikePost = asyncHandler(async (req, res) => {
  const { slug } = req.params;
  const userId = req.user._id;

  const post = await Blog.findOne({ slug });
  const senderUser = await User.findById(userId);
  console.log(senderUser,"sender User");
   
  if (!post) throw new ApiError(404, "Post not found");

  const hasLiked = post.likes.includes(userId);

  if (hasLiked) {
    await Blog.findByIdAndUpdate(post._id, {
      $pull: { likes: userId },
    });
    await Notification.findOneAndDelete({
        recipient:post.owner,
        sender: userId,
        type: "like",
        post: post._id,
    })
    return res.status(200).json(new ApiResponse(200, "Post unliked successfully", { isLiked: false }));
  } else {
    await Blog.findByIdAndUpdate(post._id, {
      $addToSet: { likes: userId },
    });
if (post.owner.toString() !== userId.toString()) {
  const notification = await Notification.create({ // ✅ store in variable
    recipient: post.owner,
    sender: userId,
    type: "like",
    post: post._id,
    message: `liked your post ${post.title}`
  });

  const recipientSocketId = onlineUsers.get(post.owner?.toString());
  console.log(recipientSocketId, "recipient Socket Id");

  if (recipientSocketId) {
    io.to(recipientSocketId).emit("new_notification", {
      ...notification.toObject(), // ✅ now in scope
      sender: {
        _id: req.user._id,
        fullName: req.user.fullName,
        avatar: req.user.avatar,
      }
    });
  }
}

    return res.status(200).json(new ApiResponse(200, "Post liked successfully", { isLiked: true }));
  }
});


export {
  addBlog,
  getPosts,
  getRecentPosts,
  postDetails,
  dashboardData,
  deleteAllPosts,
  getPublishedPosts,
  toggleLikePost,
}