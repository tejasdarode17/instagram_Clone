import { createBrowserRouter, Outlet, RouterProvider, } from "react-router-dom"
import Signup from "./components/Auth Components/Signup"
import Login from "./components/Auth Components/Login"
import SideBar from "./components/Main Components/SideBar"
import Body from "./components/Main Components/Body"
import { ThemeProvider } from "./components/Dark Mode/Theme-provider"
import Profile from "./components/Main Components/Profile/Profile"
import EditProfile from "./components/Main Components/Profile/EditProfile"
import Messages from "./components/Main Components/Chat/Messages"
import { useDispatch, useSelector } from "react-redux"
import { useEffect } from "react"
import { io } from "socket.io-client"
import { setOnlineUser } from "./Redux/chatSlice"
import { setSocket } from "./Redux/socketSlice"
import Search from "./components/Main Components/Search"
import { setLikesNotifications } from "./Redux/notificationSlice"



function AuthLayout() {
  return (
    <Outlet></Outlet>
  )
}


function MainLayout() {
  return (
    <div className="flex">
      <SideBar />
      <div className="flex-1">
        <Outlet />
      </div>
    </div>
  );
}


const approuter = createBrowserRouter([
  {
    path: "/",
    element: <AuthLayout></AuthLayout>,
    children: [
      {
        path: "/",
        element: <Login></Login>
      },
      {
        path: "/signup",
        element: <Signup></Signup>
      }
    ]
  }, {
    element: <MainLayout></MainLayout>,
    children: [
      {
        path: "/home",
        element: <Body></Body>
      },
      {
        path: '/profile/:id',
        element: <Profile></Profile>
      },
      {
        path: '/profile/edit/:id',
        element: <EditProfile></EditProfile>
      },
      {
        path: '/inbox',
        element: <Messages></Messages>
      },
      {
        path: '/search',
        element: <Search></Search>
      }
    ]
  }
])


function App() {

  const userData = useSelector(state => state.auth.userData)
  const socket = useSelector(state => state.socketio.socket)
  const dispatch = useDispatch()

  useEffect(() => {

    if (userData) {
      const socketio = io('http://localhost:3000', {
        query: {
          userID: userData?._id
        },
        transports: ['websocket']
      })

      dispatch(setSocket(socketio))


      //listning all the events 
      socketio.on('getOnlineUsers', (onlineUsers) => {
        dispatch(setOnlineUser(onlineUsers))
      })

      socketio.on('likeNotification', (notification) => {
        dispatch(setLikesNotifications(notification))
      })

      

      return () => {
        socketio.close(),
          dispatch(setSocket(null))
      }
    } else if (socket) {
      socket.close(),
        dispatch(setSocket(null))
    }

  }, [userData, dispatch])

  return (
    <>
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <RouterProvider router={approuter} > </RouterProvider>
      </ThemeProvider>
    </>
  )
}


export default App

