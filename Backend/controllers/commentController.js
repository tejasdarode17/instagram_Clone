import Post from "../models/post.model.js";
import Comment from "../models/comment.model.js";


export async function addComment(req, res) {

    try {
        const userID = req.user.userID
        const postID = req.params.id
        const { comment } = req.body


        if (!postID || !userID) {
            return res.status(400).json({
                success: false,
                message: "User token Not Provided or postID not received"
            })
        }

        if (!comment) {
            return res.status(400).json({
                success: false,
                message: "comment not provided"
            })
        }

        const newComment = await Comment.create({
            text: comment,
            author: userID,
            post: postID
        })

        const populatedComment = await newComment.populate({
            path: "author",
            select: "username , profilePicture , name"
        })

        await Post.findByIdAndUpdate(postID, { $addToSet: { comments: newComment._id } })

        return res.status(200).json({
            success: true,
            message: "commented successfully",
            comment: populatedComment,
        })

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Server error",
            error: error.message,
        });
    }
}

export async function getCommentPost(req, res) {
    try {
        const postID = req.params.id

        const comments = await Comment.find({ post: postID }).populate("author", "username , profilePicture")

        if (!comments) {
            return res.status(400).json({
                success: false,
                message: "comments not found"
            })
        }

        return res.status(200).json({
            success: true,
            message: "comments fetched",
            comments

        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Server error",
            error: error.message,
        });
    }

}

export async function deleteComment(req, res) {
    try {
        const commentId = req.params.id
        const userID = req.user.userID


        const comment = await Comment.findById(commentId)
        const post = await Post.findById(comment?.post)

        const isCommentCreator = comment?.author.toString() === userID;
        const isPostOwner = post?.author.toString() === userID;

        if (!isCommentCreator && !isPostOwner) {
            return res.status(403).json({
                success: false,
                message: "You are not authorized to delete this comment",
            });
        }

        await Post.findByIdAndUpdate(comment?.post, { $pull: { comments: commentId } })
        await Comment.findByIdAndDelete(commentId)

        return res.status(200).json({
            success: true,
            message: "comment deleted sucessfully",
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Server error",
            error: error.message,
        });
    }
}

export async function updatedComment(req, res) {

    try {
        const commentId = req.params.id
        const userID = req.user.userID
        const { comment } = req.body


        const existingComment = await Comment.findById(commentId);

        if ((!existingComment)) {
            return res.status(404).json({
                success: false,
                message: "comment not found",
            });
        }

        if (existingComment?.author !== userID) {
            return res.status(403).json({
                success: false,
                message: "You are not authorized to delete this comment",
            });
        }

        const updatedComment = Comment.findByIdAndUpdate(commentId, { text: comment }, { new: true })

        return res.status(200).json({
            success: true,
            message: "Comment updated successfully",
            comment: updatedComment
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Server error",
            error: error.message,
        });
    }
}   