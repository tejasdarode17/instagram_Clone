// useFollow.js
import { useCallback } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { updateFollowRelationship } from "@/Redux/authSlice";

export default function useFollow() {
  const dispatch = useDispatch();
  const userData = useSelector(s => s.auth.userData);
  const userProfile = useSelector(s => s.auth.userProfile);

  const isFollowing =
    userData?.following?.includes(userProfile?._id) ?? false;

  const followUser = useCallback(
    async (targetId) => {
      if (!targetId || !userData?._id) return;

      try {
        await axios.post(
          `${import.meta.env.VITE_BACKEND_URL}/user/follow/${targetId}`,
          {},
          { withCredentials: true }
        );

        // optimistic Redux update for *both* sides
        dispatch(
          updateFollowRelationship({
            targetId,              // profile you clicked
            currentUserId: userData._id,
          })
        );
      } catch (err) {
        console.error("Follow failed:", err);
      }
    },
    [dispatch, userData?._id]
  );

  return { isFollowing, followUser };
}
