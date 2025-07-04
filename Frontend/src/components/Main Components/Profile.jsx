import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar"
import { Button } from '../ui/button';
import { Settings } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import useFollow from '../../hooks/useFollow';
import { setUserProfile } from '@/Redux/authSlice';

const Profile = () => {
    const userData = useSelector(state => state.auth.userData)
    const userProfile = useSelector(state => state.auth.userData)
    const [active, setActive] = useState("Posts")
    const [loading, setLoading] = useState(false)
    const { id } = useParams();
    const { followUser, followData, isFollowing } = useFollow()
    const dispatch = useDispatch()

    const loggedinUserProfile = userProfile._id == userData?._id


    async function getUserProfileData() {
        try {
            setLoading(true)
            const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/user/${id} `)
            const data = response.data

            dispatch(setUserProfile(data?.user || {}))

        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false)
        }
    }

    async function follow() {
        await followUser(userProfile._id)
    }

    useEffect(() => {
        getUserProfileData()
    }, [id])

    if (loading) {
        <h1>Shimmer</h1>
    }

    return (
        <div className="max-w-4xl mx-auto mt-10 px-4">
            <div className="flex flex-col gap-6">
                {/* Avatar + username + buttons */}
                <div className="flex flex-col md:flex-row items-center md:items-start justify-center gap-8">
                    {/* Avatar */}
                    <Avatar className="w-36 h-36 md:w-40 md:h-40">
                        <AvatarImage
                            className="object-cover w-full h-full rounded-full"
                            src={userProfile?.profilePic || "https://github.com/shadcn.png"}
                        />
                        <AvatarFallback>
                            {userProfile?.username?.slice(0, 2)?.toUpperCase() || "UN"}
                        </AvatarFallback>
                    </Avatar>

                    {/* Info */}
                    <div className="flex flex-col items-center md:items-start gap-3">
                        <div className="flex flex-col md:flex-row items-center gap-6">
                            <p className="text-2xl font-semibold">
                                {userProfile?.username || "username"}
                            </p>
                            <div className="flex gap-3">

                                {

                                    loggedinUserProfile ? (
                                        <>
                                            <Button variant="ghost" className="border border-gray-400 px-4 py-1 text-sm pointer">
                                                Edit Profile
                                            </Button>
                                            <Settings className="w-5 h-5 mt-1.5 pointer" />
                                        </>
                                    ) : (
                                        <>
                                            {
                                                isFollowing ? (
                                                    <Button onClick={follow} variant="ghost" className="border border-gray-400 px-4 py-1 text-sm pointer">
                                                        Following
                                                    </Button>
                                                ) : (
                                                    <Button onClick={follow} variant="ghost" className="border border-gray-400 px-4 py-1 text-sm pointer">
                                                        Follow
                                                    </Button>
                                                )
                                            }
                                            <Button variant="ghost" className="border border-gray-400 px-4 py-1 text-sm pointer">
                                                Message
                                            </Button>
                                        </>
                                    )
                                }
                            </div>
                        </div>

                        <div className="flex gap-10 text-sm text-muted-foreground">
                            <p>
                                <span className="font-medium text-white">
                                    {userProfile?.posts?.length || 0}
                                </span>{" "}
                                posts
                            </p>
                            <p>
                                <span className="font-medium text-white">
                                    {userProfile?.followers?.length || 0}
                                </span>{" "}
                                followers
                            </p>
                            <p>
                                <span className="font-medium text-white">
                                    {userProfile?.following?.length || 0}
                                </span>{" "}
                                following
                            </p>
                        </div>

                        <div className="text-sm mt-2 flex flex-col gap-2 text-center md:text-left">
                            <p>
                                {userProfile?.name}
                            </p>
                            <p>
                                {userProfile?.bio || "Hello Im a Fullstack Developer"}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <div className='flex justify-center mt-20 border-t pt-1 gap-50'>
                <span onClick={() => setActive("Posts")} className={`pointer ${active == "Post" ? 'font-extrabold' : ''}`} >Posts</span>
                <span onClick={() => setActive("Reels")} className={`pointer ${active == "Reels" ? 'font-extrabold' : ''}`} >Reels</span>
            </div>

            <UserPosts userProfile={userProfile} active={active} loading={loading} ></UserPosts>
        </div >
    )
}







const UserPosts = ({ userProfile, active, loading }) => {

    const displayPost = userProfile?.posts || [];



    if (active === "Reels") {
        return (
            <div className="text-center text-muted-foreground mt-10">
                No reels yet.
            </div>
        );
    }

    if (!displayPost.length) {
        return (
            <div className="text-center text-muted-foreground mt-10">
                No posts yet.
            </div>
        );
    }

    if (loading) <h1>Shimmer</h1>
    return (
        <div className="max-w-[935px] mx-auto mt-8 px-4">
            <div className="grid grid-cols-3 gap-5">
                {
                    displayPost?.map((p) => (
                        <div key={p._id} className="relative w-full aspect-square overflow-hidden">
                            <img
                                src={p.postImage}
                                alt="User post"
                                className="w-full h-full object-cover transition-transform duration-200 hover:scale-105"
                            />
                        </div>
                    ))
                }
            </div>
        </div>
    )
}


export default Profile
