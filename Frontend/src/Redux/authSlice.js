import { createSlice } from "@reduxjs/toolkit"

const authSlice = createSlice({
    name: "auth",
    initialState: {
        userData: null,
        userProfile: {}
    },
    reducers: {

        setuserData(state, action) {
            state.userData = action.payload
        },
        setUserProfile(state , action){
            state.userProfile = action.payload
        }

    }
})


export const { setuserData , setUserProfile } = authSlice.actions
export default authSlice.reducer