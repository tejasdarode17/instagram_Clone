import mongoose from "mongoose";


const postSchema = new mongoose.Schema({

    caption: {
        type: String,
    },

    postImage: {
        type: String,
    },

    postImageID: {
        type: String,
    },

    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },

    likes: [
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

const Post = mongoose.model("Post", postSchema)

export default Post