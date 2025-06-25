import mongoose from "mongoose";
import { Post } from "./post.model";

const commentSchema = new mongoose.Schema({
    text: {
        type: String,
        required: true,
    },

    auther: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },

    post: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Post",
        required: true
    }

})

export const Comment = mongoose.model("Comment", commentSchema)