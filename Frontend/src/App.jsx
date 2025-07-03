import { createBrowserRouter, Outlet, RouterProvider, } from "react-router-dom"
import Signup from "./components/Auth Components/Signup"
import Login from "./components/Auth Components/Login"
import SideBar from "./components/Main Components/SideBar"
import Body from "./components/Main Components/Body"
import Profile from "./components/Main Components/Profile"
import { ThemeProvider } from "./components/Dark Mode/Theme-provider"





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
      }
    ]
  }
])


function App() {

  return (
    <>
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <RouterProvider router={approuter} > </RouterProvider>
      </ThemeProvider>
    </>
  )
}



export default App

