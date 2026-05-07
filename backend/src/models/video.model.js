import mongoose from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

const videoSchema = new mongoose.Schema({
    videoFile: {
        type: String, //Cloudinary url of the video file
        required: [true, "Video file is required"],
    },
    thumbnail: {
        type: String, //Cloudinary url of the thumbnail image
        required: [true, "Thumbnail image is required"],
    },
    title: {
        type: String,
        required: [true, "Video title is required"],
    },
    description: {
        type: String,
    },
    duration: {
        type: Number, // Duration of the video in seconds
        required: true,
    },
    views: {
        type: Number,
        default: 0,
    },
    isPublished: {
        type: Boolean,
        default: true,
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    }
}, {timestamps: true});


videoSchema.plugin(mongooseAggregatePaginate);

export const Video = mongoose.model("Video", videoSchema);