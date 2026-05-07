import mongoose from "mongoose";


const likeSchema = new mongoose.Schema({
    likedPost: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Blog",
    },
    likedPostUser: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    }
    
},{timestamps: true})

export const Like = mongoose.model("Like", likeSchema);