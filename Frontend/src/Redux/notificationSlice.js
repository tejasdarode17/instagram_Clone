import { createSlice } from "@reduxjs/toolkit"

const notificationSlice = createSlice({
    name: "notification",
    initialState: {
        likeNotifications: [],
        followNotifications: [],
        commentNotifications: [],
        unreadTotal: 0,
    },
    reducers: {
        setLikesNotifications(state, action) {
            state.likeNotifications.push(action.payload)
            state.unreadTotal += 1;
        },
        setCommentNotifications(state, action) {
            state.commentNotifications.push(action.payload)
        },
        setFollowNotifications(state, action) {
            state.followNotifications.push(action.payload)
        },
        resetAllUnread(state) {
            state.unreadTotal = 0;
        },
    }
})

export const {
    setLikesNotifications,
    setCommentNotifications,
    setFollowNotifications,
    resetAllUnread
} = notificationSlice.actions

export default notificationSlice.reducer
