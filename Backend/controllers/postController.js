import Post from "../models/post.model.js";
import User from "../models/user.model.js";
import { uploadImage } from "../utils/imageHandler.js";

export async function createPost(req, res) {

    try {
        const { caption } = req.body
        const image = req.file
        const userID = req.user.userID

        const user = await User.findById(userID);

        // if (!image) {
        //     return res.status(401).json({
        //         success: false,
        //         message: "Image Required",
        //     });
        // }

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "user not found",
            });
        }


        let imageURL = ""
        let imageID = ""

        if (image) {
            try {
                const uploaded = await uploadImage(image.buffer);
                imageURL = uploaded.secure_url;
                imageID = uploaded.public_id;
            } catch (err) {
                return res.status(500).json({ success: false, message: 'Image upload failed', error: err.message });
            }
        }

        const newPost = await Post.create({
            caption,
            postImage: imageURL,
            postImageID: imageID,
            author: userID
        })


        await User.findByIdAndUpdate(userID, { $addToSet: { posts: newPost._id } });

        const populatedPost = await Post.findById(newPost._id).populate({
            path: "author",
            select: "name username profilePicture"
        })

        return res.status(200).json({
            success: true,
            message: "Blog uploaded successfully",
            post: populatedPost
        });

    } catch (err) {
        console.error(err);
        return res.status(500).json({
            success: false,
            message: "Server error",
            error: err.message,
        });
    }
}