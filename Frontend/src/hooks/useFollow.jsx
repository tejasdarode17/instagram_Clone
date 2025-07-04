import { useState, useCallback } from "react";
import axios from "axios";
import { useSelector } from "react-redux";

export default function useFollow() {
  const [followData, setFollowData] = useState(null);
  const userData = useSelector(state => state.auth.userData)
  const userProfile = useSelector(state => state.auth.userProfile)
  const [isFollowing, setIsFollowing] = useState(userData?.following?.includes(userProfile?._id))

  const followUser = useCallback(async (targetId) => {
    if (!targetId) return;

    try {
      const { data } = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/user/follow/${targetId}`,
        {},
        { withCredentials: true }
      );
      setFollowData(data);
      console.log(data);
      setIsFollowing((prev) => !prev)

    } catch (err) {
      console.error("Follow failed:", err);
    }
  }, []);

  return { followData, followUser, isFollowing };
}
