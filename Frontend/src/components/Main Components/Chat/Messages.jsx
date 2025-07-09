import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { setSelectedUser } from '@/Redux/authSlice'
import { Avatar, AvatarImage } from '@radix-ui/react-avatar'
import axios from 'axios'
import { Search } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { setMessages } from '@/Redux/chatSlice'

const Messages = () => {
  const suggestedUsers = useSelector(state => state.auth.suggestedUsers)
  const selectedUser = useSelector(state => state.auth.selectedUser)
  const onlineUsers = useSelector(state => state.chat.onlineUsers)
  const [textMessage, setTextMessage] = useState("")

  const messages = useSelector(state => state.chat.messages || [])

  const userData = useSelector(state => state.auth.userData)
  const socket = useSelector(state => state.socketio.socket);

  const scrollRef = useRef(null);
  const dispatch = useDispatch()


  async function sendMessage() {
    try {
      const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/message/${selectedUser?._id}`, { message: textMessage }, {
        withCredentials: true
      })
      const data = response.data
      console.log(data);
      dispatch(setMessages([...messages, data.message]))
      setTextMessage("")
    } catch (error) {
      console.log(error);
    }
  }

  async function getAllMessages() {
    try {
      const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/messages/${selectedUser?._id}`, { withCredentials: true })
      const data = response.data
      dispatch(setMessages(data?.conversation?.messages || []))
    } catch (error) {
      console.log(error);
    }
  }


  useEffect(() => {
    socket?.on('newMessage', (msg) => {
      dispatch(setMessages([...messages, msg]))
    })

  }, [messages, setMessages])

  useEffect(() => {
    if (!scrollRef.current) return;
    scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages]);


  useEffect(() => {
    dispatch(setMessages([]));
    if (selectedUser?._id) getAllMessages();
  }, [selectedUser?._id, dispatch]);


  return (
    <div className="flex h-[calc(100vh-60px)] pl-[17%] w-ful text-white">
      {/* Users List - Fixed width */}
      <div className='w-[350px] h-screen  border-r border-gray-800 flex flex-col '>
        <div className='p-4 border-b border-gray-800'>
          <div className='flex relative'>
            <Input
              className='w-full border-gray-700 text-white'
              placeholder="Search"
            />
            <Button
              className='absolute right-0 bg-transparent hover:bg-transparent'
              variant='ghost'
            >
              <Search size={18} className='text-gray-400' />
            </Button>
          </div>
        </div>

        <div className='flex-1 overflow-y-auto'>
          {suggestedUsers.map((user) => {
            const isOnline = onlineUsers.includes(user._id)
            return (
              <div
                key={user.id}
                onClick={() => dispatch(setSelectedUser(user))}
                className='w-full p-3 flex gap-3 hover:bg-gray-800 cursor-pointer border-b border-gray-800'
              >
                <Avatar>
                  <AvatarImage
                    className='w-10 h-10 rounded-full object-cover'
                    src={user?.profilePicture}
                  />
                </Avatar>
                <div>
                  <p className='font-medium'>{user?.name}</p>
                  <p className={`text-sm  ${isOnline ? "text-green-600" : ""}`}>{isOnline ? "online" : ""}</p>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Chat Area - Flexible width */}
      {
        selectedUser ? (
          <div className='flex-1 flex flex-col h-screen'>
            {/* Chat header */}
            <div className='flex gap-3 items-center border-b border-gray-800 p-4'>
              <Avatar>
                <AvatarImage
                  className='w-10 h-10 rounded-full object-cover'
                  src={selectedUser?.profilePicture}
                />
              </Avatar>
              <div>
                <h1 className='font-medium'>{selectedUser?.name}</h1>
                <h1 className='text-sm text-gray-400'>@{selectedUser?.username}</h1>
              </div>
            </div>

            {/* Messages area */}
            <div className="flex-1 chat-scroll p-4 overflow-y-auto bg-gray-950" ref={scrollRef} >
              {(messages || []).map((m) => (
                <p
                  key={m?._id}
                  className={`mb-2 ${m?.senderID === userData?._id ? 'text-right text-blue-400' : 'text-left'
                    }`}
                >
                  {m?.message}
                </p>
              ))}
            </div>

            {/* Message input */}
            <div className='p-4 border-t border-gray-800'>
              <div className='flex gap-2'>
                <Input
                  className='flex-1 bg-gray-800 border-gray-700 text-white'
                  placeholder={`Message @${selectedUser?.username}`}
                  onChange={(e) => setTextMessage(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      sendMessage();
                    }
                  }}
                  value={textMessage}
                />
                <Button onClick={() => sendMessage()} className='bg-blue-600 hover:bg-blue-700'>Send</Button>
              </div>
            </div>
          </div>
        ) : (
          <div className='flex-1 flex items-center justify-center bg-gray-900'>
            <div className='text-center text-gray-400'>
              <h2 className='text-xl font-medium mb-2'>Select a message</h2>
              <p>Choose from your existing conversations or start a new one</p>
            </div>
          </div>
        )
      }
    </div >
  )
}

export default Messages