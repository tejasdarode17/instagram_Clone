import { Outlet } from "react-router-dom"
import Feed from "./Feed/Feed"
import RightSideBar from "./RightSideBar"

const Body = () => {
  return (
    <div className="flex">
      <div className="flex flex-grow">
        <Feed></Feed>
      </div>
      <RightSideBar></RightSideBar>
    </div>
  )
}

export default Body


