import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
    name: "auth",
    initialState: { userData: null, userProfile: {} },
    reducers: {
        setuserData(state, action) {
            state.userData = action.payload;
        },
        setUserProfile(state, action) {
            state.userProfile = action.payload;
        },
        updateFollowRelationship(state, action) {
            const { targetId, currentUserId } = action.payload;
            if (!state.userData) return;

            //Loggedinuser Following 
            if (!state.userData.following) state.userData.following = [];

            const idx = state.userData.following.indexOf(targetId);
            if (idx !== -1) {
                state.userData.following.splice(idx, 1);
            } else {
                state.userData.following.push(targetId);
            }
            //Searched user Followers
            if (state.userProfile?._id === targetId) {
                if (!state.userProfile.followers) state.userProfile.followers = [];

                const fIdx = state.userProfile.followers.indexOf(currentUserId);
                if (fIdx !== -1) {
                    state.userProfile.followers.splice(fIdx, 1);
                } else {
                    state.userProfile.followers.push(currentUserId);
                }
            }
        },
        updateUser(state, action) {
            state.userData = action.payload
        }
    },
});

export const { setuserData, setUserProfile, updateFollowRelationship, updateUser } = authSlice.actions;
export default authSlice.reducer;
