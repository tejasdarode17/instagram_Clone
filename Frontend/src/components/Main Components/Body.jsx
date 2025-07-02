import Feed from "./Feed/Feed"
import RightSideBar from "./RightSideBar"

const Body = () => {
  return (
    <div className="w-full flex">
      <div className="w-full flex">
        <Feed></Feed>
      </div>
        <RightSideBar></RightSideBar>
    </div>
  )
}

export default Body


