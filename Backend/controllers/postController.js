import Post from "../models/post.model.js";
import User from "../models/user.model.js";
import { uploadImage } from "../utils/imageHandler.js";

export async function createPost(req, res) {

    try {
        const { caption } = req.body
        const image = req.file
        const userID = req.user.userID

        const user = await User.findById(userID);

        if (!image) {
            return res.status(401).json({
                success: false,
                message: "Image Required",
            });
        }

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
            message: "Post uploaded successfully",
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

export async function getAllPosts(req, res) {

    try {
        const posts = await Post.find().sort({ createdAt: -1 })
            .populate({
                path: "author",
                select: "name username profilePicture"
            }
            ).populate({
                path: "likes",
                select: "name username profilePicture"
            })
            .populate({
                path: "comments",
                sort: { createdAt: -1 },
                populate: {
                    path: "author",
                    select: "name username profilePicture"
                }
            })

        return res.status(200).json({
            message: "Fetched all the post successfully",
            success: true,
            posts
        })
    } catch (err) {
        console.error(err);
        return res.status(500).json({
            success: false,
            message: "Server error",
            error: err.message,
        });
    }
}

export async function getUserPosts(req, res) {

    try {
        const userID = req.user.userID;

        if (!userID) {
            return res.status(400).json({
                success: false,
                message: "User token Not Provided"
            })
        }

        const posts = await Post.findById({ author: userID }).sort({ createdAt: -1 })
            .populate({
                path: "author",
                select: "name profilePicture"
            }
            ).populate({
                path: "likes",
                select: "name profilePicture"
            })
            .populate({
                path: "comments",
                sort: { createdAt: -1 },
                populate: {
                    path: "author",
                    select: "name profilePicture"
                }
            })


        return res.status(200).json({
            message: "Fetched all the post successfully",
            success: true,
            posts
        })

    } catch (err) {
        console.error(err);
        return res.status(500).json({
            success: false,
            message: "Server error",
            error: err.message,
        });
    }
}

export async function likePost(req, res) {
    try {

        const postID = req.params.id
        const userID = req.user.userID

        if (!postID || !userID) {
            return res.status(400).json({
                success: false,
                message: "User token Not Provided or postID not received"
            })
        }

        const post = await Post.findById(postID);

        if (post.likes.includes(userID)) {
            const updatedPost = await Post.findByIdAndUpdate(postID, { $pull: { likes: userID } }, { new: true })
            return res.status(200).json({
                success: true,
                message: "Post Unliked",
                updatedPost
            })
        } else {
            const updatedPost = await Post.findByIdAndUpdate(postID, { $addToSet: { likes: userID } }, { new: true })
            return res.status(200).json({
                success: true,
                message: "Post liked",
                updatedPost
            })
        }

    } catch (error) {
        console.error(err);
        return res.status(500).json({
            success: false,
            message: "Server error",
            error: error.message,
        });
    }
}

export async function deletePost(req, res) {

    try {
        const userID = req.user.userID
        const postID = res.params.id

        const post = await Post.findById(postID);

        if (!post) {
            return res.status(404).json({ success: false, message: "Blog not found" });
        }

        if (post.author.toString() !== userID) {
            return res.status(400).json({
                success: false,
                message: "You are not authorize to delete this post"
            })
        }

        await Post.findByIdAndDelete(postID)
        await User.findByIdAndUpdate(userID, { $pull: { posts: postID } });

        await Comment.deleteMany({ post: postID })

        return res.status(200).json({
            success: true,
            message: "Post deleted Sucessfully",
        })

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Server error",
            error: error.message,
        });
    }
}


