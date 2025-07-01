import { createBrowserRouter, Outlet, RouterProvider, } from "react-router-dom"
import Signup from "./components/Auth Components/Signup"
import Login from "./components/Auth Components/Login"
import SideBar from "./components/Main Components/SideBar"
import Body from "./components/Main Components/Body"





function AuthLayout() {
  return (
    <Outlet></Outlet>
  )
}

function MainLayout() {
  return (
    <>
      <SideBar></SideBar>
      <Outlet></Outlet>
    </>
  )
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
    path: "/home",
    element: <MainLayout></MainLayout>,
    children: [
      {
        path: "/home",
        element: <Body></Body>
      }
    ]
  }
])


function App() {

  return (
    <>
      <RouterProvider router={approuter} > </RouterProvider>
    </>
  )
}



export default App

