import { createSlice } from "@reduxjs/toolkit"

const authSlice = createSlice({
    name: "auth",
    initialState: {
        userData: null
    },
    reducers: {

        setuserData(state, action) {
            state.userData = action.payload
        }

    }
})


export const { setuserData } = authSlice.actions
export default authSlice.reducer