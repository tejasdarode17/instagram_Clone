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
            return res.status(401).json({
                success: false,
                message: "user not found",
            });
        }

        let uploadedImage

        if (image) {
            try {
                uploadedImage = await uploadImage(image.buffer);
            } catch (uploadErr) {
                return res.status(500).json({
                    success: false,
                    message: "Image upload failed",
                    error: uploadErr.message,
                });
            }
        }

        const newPost = Post.create({
            caption,
            postImage: uploadedImage.secure_url,
            postImageID: uploadedImage.public_id
        })

        if (user) {
            user.posts.push(newPost._id)
            await user.save()
        }

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