import { Avatar, AvatarFallback, AvatarImage } from '@radix-ui/react-avatar'
import { Heart, HomeIcon, LogOut, MessageCircle, PlusSquare, Search, TrendingUp } from 'lucide-react'
import React, { useState } from 'react'
import axios from 'axios'
import { toast } from 'sonner'
import { useNavigate } from 'react-router-dom'
import CreatePost from './CreatePost'
import { useSelector } from 'react-redux'
import ModeToggle from '../Dark Mode/ModeToggle'


const SideBar = () => {

  const [createPostOpen, setCreatePostOpen] = useState(false)
  const navigate = useNavigate()
  const userData = useSelector((state) => state.auth.userData)


  const sideBarItems = [
    { text: "Home", icon: <HomeIcon /> },
    { text: "Search", icon: <Search /> },
    { text: "Explore", icon: <TrendingUp /> },
    { text: "Create", icon: <PlusSquare /> },
    { text: "Messages", icon: <MessageCircle /> },
    { text: "Notification", icon: <Heart /> },
    { text: "Logout", icon: <LogOut /> },
    {
      text: "Profile", icon: (
        <Avatar>
          <AvatarImage className='w-5 rounded-full' src={userData?.profilePicture} />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
      )
    },
  ]

  async function logout() {
    try {
      const response = await axios.get("http://localhost:3000/api/v1/logout", {
        withCredentials: true
      });
      const data = await response.data
      toast.success(data?.message)
      navigate("/")
    } catch (error) {
      console.log(error);
    }
  }

  function handleSidebar(i) {
    if (i.text === "Logout") {
      logout()
    }
    if (i.text === 'Create') {
      setCreatePostOpen((prev) => prev = true)
    }
    if (i.text === 'Profile') {
      navigate(`/profile/${userData._id}`)
    }
    if (i.text === 'Home') {
      navigate(`/home`)
    }
  }


  return (
    <div className='fixed top-0 left-0 z-10 px-4 w-[16%] h-screen  border-r border-gray-500'>
      <div className='flex flex-col gap-3'>
        <div className='flex items-center w-10 h-10 gap-2 mt-2'>
          <img
            src="logo.png"
            alt=""
            className='rounded-md' />
          <p className='italic font-bold'>Zingagram</p>
        </div>
        <div>
          {
            sideBarItems.map((item, i) => (

              <button key={i} onClick={() => handleSidebar(item)} className='w-full rounded-sm flex items-center gap-3 hover:bg-gray-800 p-3 pointer my-3'>
                <h1>{item.icon}</h1>
                <h1>{item.text}</h1>
              </button>
            ))
          }
        </div>
      </div>
      <ModeToggle></ModeToggle>
      <CreatePost open={createPostOpen} close={setCreatePostOpen} ></CreatePost>
    </div>
  )
}

export default SideBar


