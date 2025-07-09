import { Heart, HomeIcon, LogOut, MessageCircle, PlusSquare, Search, TrendingUp, } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@radix-ui/react-avatar';
import { Popover, PopoverTrigger, PopoverContent } from '../ui/popover';
import CreatePost from '../Main Components/Feed/CreatePost';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import React, { useState } from 'react';
import axios from 'axios';
import { resetAllUnread } from '@/Redux/notificationSlice';

const SideBar = () => {
  const [createPostOpen, setCreatePostOpen] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const userData = useSelector((state) => state.auth.userData);
  const likeNotifications = useSelector((state) => state.notification?.likeNotifications);
  const unreadTotal = useSelector((state) => state.notification.unreadTotal)

  const sideBarItems = [
    { text: 'Home', icon: <HomeIcon /> },
    { text: 'Search', icon: <Search /> },
    { text: 'Explore', icon: <TrendingUp /> },
    { text: 'Create', icon: <PlusSquare /> },
    { text: 'Messages', icon: <MessageCircle /> },
    { text: 'Notification', icon: <Heart /> },
    { text: 'Logout', icon: <LogOut /> },
    {
      text: 'Profile',
      icon: (
        <Avatar>
          <AvatarImage
            className="w-10 h-10 rounded-full object-cover"
            src={userData?.profilePicture}
          />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
      ),
    },
  ];

  async function logout() {
    try {
      const response = await axios.get('http://localhost:3000/api/v1/logout', {
        withCredentials: true,
      });
      toast.success(response.data?.message);
      navigate('/');
    } catch (error) {
      console.error(error);
    }
  }

  function handleSidebar(item) {
    switch (item.text) {
      case 'Logout':
        logout();
        break;
      case 'Create':
        setCreatePostOpen(true);
        break;
      case 'Profile':
        navigate(`/profile/${userData?._id}`);
        break;
      case 'Home':
        navigate('/home');
        break;
      case 'Messages':
        navigate('/inbox');
        break;
      case 'Search':
        navigate('/search');
        break;
      default:
        break;
    }
  }

  return (
    <div className="fixed top-0 left-0 z-10 px-4 w-[16%] h-screen border-r border-gray-500">
      <div className="flex flex-col gap-3">
        <div className="flex items-center w-10 h-10 gap-2 mt-2">
          <img src="logo.png" alt="Zingagram" className="rounded-md" />
          <p className="italic font-bold">Zingagram</p>
        </div>

        <div>
          {sideBarItems.map((item, i) => {
            if (item?.text === 'Notification') {
              return (
                <Popover key={i}>
                  <PopoverTrigger asChild>
                    <button
                      onClick={() => {
                        handleSidebar(item);
                        dispatch(resetAllUnread())
                      }}
                      className="w-full relative flex items-center gap-3 hover:bg-gray-800 p-3 my-3 rounded-sm"
                    >
                      <span>{item?.icon}</span>
                      <span>{item?.text}</span>
                      {unreadTotal > 0 && (
                        <span className="absolute top-3 left-7.5 flex h-2 w-2 items-center justify-center rounded-full bg-red-600 text-xs">

                        </span>
                      )}
                    </button>
                  </PopoverTrigger>

                  <PopoverContent className="w-80 p-4 flex flex-col gap-5 overflow-y-auto">
                    {likeNotifications?.length === 0 ? (
                      <p className="text-sm text-gray-400">No new notifications</p>
                    ) : (
                      likeNotifications?.map((n, idx) => (
                        <div className='flex gap-2 items-center'>
                          <Avatar>
                            <AvatarImage className="w-8 h-8 rounded-full object-cover" src={n?.userDetails?.profilePicture} />
                            <AvatarFallback>img</AvatarFallback>
                          </Avatar>
                          <p className='font-semiboldF'>{n?.userDetails?.username}</p>
                          <p>Liked your Post</p>
                        </div>
                      ))
                    )}
                  </PopoverContent>
                </Popover>
              );
            }

            return (
              <button
                key={i}
                onClick={() => handleSidebar(item)}
                className="w-full flex items-center gap-3 hover:bg-gray-800 p-3 my-3 rounded-sm"
              >
                {item.icon}
                <span>{item.text}</span>
              </button>
            );
          })}
        </div>
      </div>

      <CreatePost open={createPostOpen} close={setCreatePostOpen} />
    </div>
  );
};

export default SideBar;
