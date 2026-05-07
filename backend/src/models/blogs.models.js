import mongoose from "mongoose";

const blogSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        index: true,
    },
    description: {
        type: String,
        required: true,
        lowercase: true,
    },
    image: {
        type: String,
        required:true,
    },
    owner : {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
    category: {
        type: String,
        required: true, 
    },
    slug: {
        type: String,
    },
    status: {
        type: String,
        enum: ["published", "draft"],
        default: "published",
    },
    likes: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    }
  ],

},{timestamps: true})


export const Blog = mongoose.model("Blog",blogSchema);