import mongoose from "mongoose";


const postSchema = new mongoose.Schema({

    caption: {
        type: String,
    },

    image: {
        type: String,
    },

    auther: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },

    Likes: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        }
    ],

    comments: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Comments"
        }
    ]

}, { timestamps: true }

)


export const Post = mongoose.model("Post", postSchema)