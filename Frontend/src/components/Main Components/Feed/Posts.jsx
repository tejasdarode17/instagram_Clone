import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar"
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"
import { Bookmark, Ghost, Heart, MessageCircle, MoreHorizontal, Send } from "lucide-react"
import { useEffect, useState } from "react"
import Comment from "./Comment";
import axios from "axios"
import { useDispatch, useSelector } from "react-redux"
import { setPostData } from "@/Redux/postSlice"

const Posts = () => {
    const dispatch = useDispatch()
    const posts = useSelector(state => state.posts.postData || [])

    async function getAllPosts() {
        try {

            const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/post`)
            const data = await response.data
            console.log(data);
            dispatch(setPostData(data?.posts))

        } catch (error) {
            console.log(error);
        }
    }


    useEffect(() => {
        getAllPosts()
    }, [])

    return (
        <div className="flex flex-col gap-5">
            {
                (posts || []).map((post) => (
                    <div>
                        <Post post={post}></Post>
                    </div>
                ))
            }
        </div>
    )
}


export default Posts

export const Post = ({ post }) => {

    const [commetOpen, setCommentOpen] = useState(false)

    return (
        <div className="w-full my-8 max-w-md">
            <div className="flex items-center my-1 justify-between">
                <div className="flex gap-2 items-center mb-1">
                    <Avatar>
                        <AvatarImage className="w-8 h-8 rounded-full" src={post?.author?.profilePicture} />
                        <AvatarFallback>CN</AvatarFallback>
                    </Avatar>
                    <h1>{post?.author?.username}</h1>
                </div>

                <Dialog>
                    <DialogTrigger asChild>
                        <button type="button">
                            <MoreHorizontal className="h-5 w-5 cursor-pointer" />
                        </button>
                    </DialogTrigger>
                    <DialogContent className="w-full p-2">
                        <Button className="w-fit mx-auto text-red-600 pointer hover:bg-gray-200 border-black border-2" variant={Ghost} >Unfollow</Button>
                        <Button className="w-fit mx-auto text-red-600 pointer hover:bg-gray-200" variant={Ghost} >Report</Button>
                        <Button className="w-fit mx-auto  pointer hover:bg-gray-200" variant={Ghost} >Save</Button>
                    </DialogContent>
                </Dialog>
            </div>
            <div className="">
                <img className="" src={post?.postImage} alt="" />
            </div>

            <div className="flex justify-between items-center my-2">
                <div className="flex gap-2">
                    <Heart className="pointer"></Heart>
                    <MessageCircle onClick={() => setCommentOpen(true)} className="pointer">
                    </MessageCircle>
                    <Send className="pointer" />
                </div>
                <Bookmark className="pointer"></Bookmark>
            </div>
            <div className="flex flex-col gap-2">
                <span className="font-medium block pointer">1K likes</span>
                <p>
                    <span className="font-semibold mr-1">
                        {post?.author?.username}
                    </span>
                    <span>
                        Im a fullstack developer
                    </span>
                </p>
                <p>
                    <button onClick={() => setCommentOpen(true)} className="pointer">View all 500 comments</button>
                </p>
                <Comment open={commetOpen} setCommentOpen={setCommentOpen}  ></Comment>
                <div className="flex justify-between items-center">
                    <input type="text" placeholder="add a comment" className="focus:outline-none w-full" />
                    <span className="text-[#38ADf8] pointer">Post</span>
                </div>
            </div>
        </div>
    )
}



