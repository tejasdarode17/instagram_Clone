import { createBrowserRouter, Outlet, RouterProvider, } from "react-router-dom"
import Signup from "./components/Auth Components/Signup"
import Login from "./components/Auth Components/Login"





function AuthLayout() {
  return (
    <Outlet></Outlet>
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

