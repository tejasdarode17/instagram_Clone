import { createSlice } from "@reduxjs/toolkit";

const postSlice = createSlice({
    name: "posts",
    initialState: {
        postData: []
    },
    reducers: {

        setPostData(state, action) {
            state.postData = action.payload
        },

        updatePostLikes(state, action) {
            const { id, likes } = action.payload
            const post = state.postData.find((p) => p._id === id)
            if (post) post.likes = likes
        },

        updatePostComments(state, action) {
            const { postID, comment } = action.payload
            const post = state.postData.find((p) => p._id === postID)
            if (post) {
                post.comments.push(comment)
            }
        },

        deletePostComment(state, action) {
            const { commentID, postID } = action.payload;
            const post = state.postData.find(post => post._id === postID);
            if (!post) return;
            post.comments = post.comments.filter(comment => comment._id !== commentID);
        }
        
    }
})

export const { setPostData, updatePostLikes, updatePostComments, deletePostComment } = postSlice.actions
export default postSlice.reducer