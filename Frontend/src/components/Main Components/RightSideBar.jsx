import axios from 'axios'
import React, { useEffect } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar"
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { setSuggestedUser } from '@/Redux/authSlice'

const RightSideBar = () => {

    const suggestedUsers = useSelector(state => state.auth.suggestedUsers)
    const userData = useSelector(state => state.auth.userData)

    const dispatch = useDispatch()
    async function getSuggestedUser() {
        try {
            const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/suggestion/user`, { withCredentials: true })
            const data = response?.data
            dispatch(setSuggestedUser(data?.users))
        } catch (error) {
            console.log(error);
        }
    }
    useEffect(() => {
        getSuggestedUser()
    }, [])


    


    return (
        <div className='xl:absolute right-0 top-0 Z-10 h-screen w-[25%] overflow-x-hidden overflow-y-auto'>
            <div className='my-5 flex flex-col gap-5'>
                <div className='flex items-center gap-5' key={userData?.id + Math.random()}>
                    <Link to={`/profile/${userData?._id}`}>
                        <Avatar>
                            <AvatarImage className="w-8 h-8 rounded-full object-cover" src={userData?.profilePicture} />
                            <AvatarFallback>img</AvatarFallback>
                        </Avatar>
                    </Link>
                    <Link to={`/profile/${userData?._id}`}>
                        <h1>{userData?.username}</h1>
                    </Link>
                </div>
                <p className='text-sm'>Suggested for you</p>
            </div>
            <div>
                {
                    (suggestedUsers || []).map((user) => (
                        <Link to={`/profile/${user._id}`} key={user?.username} >
                            <div className='flex justify-between my-5'>
                                <div className='flex items-center gap-5' >
                                    <Avatar>
                                        <AvatarImage className="w-10 h-10 rounded-full object-cover" src={user?.profilePicture} />
                                        <AvatarFallback>CN</AvatarFallback>
                                    </Avatar>
                                    <p>{user?.username}</p>
                                </div>
                                <button className='mr-10 text-blue-500 text-sm pointer'>follow</button>
                            </div>
                        </Link>
                    ))
                }

            </div>
        </div >
    )
}

export default RightSideBar
