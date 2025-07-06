import { createSlice } from "@reduxjs/toolkit";


const chatSlice = createSlice({
    name: "chat",
    initialState: {
        onlineUsers: []
    },
    reducers: {
        setOnlineUser(state, action) {
            state.onlineUsers = action.payload
        }
    }

})



export const { setOnlineUser } = chatSlice.actions
export default chatSlice.reducer