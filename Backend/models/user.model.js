import mongoose from "mongoose";

const userSchema = new mongoose.Schema({

    username: {
        type: String,
        required: true,
        unique: true,
    },

    name: {
        type: String,
        required: true
    },

    email: {
        type: String,
        required: true,
        unique: true,
    },

    password: {
        type: String,
    },

    profilePicture: {
        type: String,
        default: "https://cdn-icons-png.flaticon.com/512/149/149071.png"
    },

    profilePictureID: {
        type: String
    },

    bio: {
        type: String,
    },

    gender: {
        type: String,
        enum: ['male', 'female']
    },

    followers: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        }
    ],

    following: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        }
    ],
},

    { timestamps: true }
)




export const User = mongoose.model("User", userSchema)
