import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar"
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"
import { Bookmark, Ghost, Heart, MessageCircle, MoreHorizontal, Send } from "lucide-react"
import { useEffect, useState } from "react"
import Comment from "./Comment";
import axios from "axios"
import { useDispatch, useSelector } from "react-redux"
import { setPostData, updatePostComments, updatePostLikes } from "@/Redux/postSlice"
import { toast } from "sonner"

const Posts = () => {
    const dispatch = useDispatch()
    const posts = useSelector(state => state.posts.postData || [])

    async function getAllPosts() {
        try {

            const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/post`)
            const data = response.data
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
                    <div key={post._id}>
                        <Post post={post}></Post>
                    </div>
                ))
            }
        </div>
    )
}

export const Post = ({ post }) => {

    const userData = useSelector(state => state.auth.userData)
    const [commetOpen, setCommentOpen] = useState(false)
    const [commetText, setCommentText] = useState("")
    const [isLiked, setIsLiked] = useState(post?.likes?.includes(userData?._id))
    const dispatch = useDispatch()

    async function postLikeUnlike() {
        try {
            const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/like/post/${post._id}`, {}, { withCredentials: true })
            const data = response.data
            toast.success(data?.message)
            setIsLiked((prev) => !prev)
            dispatch(updatePostLikes({ id: post._id, likes: data?.updatedPost?.likes }))
        } catch (error) {
            console.log(error);
        }
    }

    async function addComment(e) {
        try {
            const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/user/comment/post/${post._id}`, { comment: commetText }, {
                withCredentials: true
            });
            const data = response.data
            console.log(data);
            dispatch(updatePostComments({ postID: post._id, comment: data?.comment }))
            toast.success(data?.message)
            setCommentText("")
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <div className="w-[40vw] my-8">
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
                    <DialogContent className="w-100 p-2 bg-[#262626] outline-none border-none">
                        <Button className="w-fit mx-auto text-red-600 pointer hover:bg-[#181818] border-red-600 border-2" variant={Ghost} >Unfollow</Button>
                        <Button className="w-fit mx-auto text-red-600 pointer hover:bg-[#181818]" variant={Ghost} >Report</Button>
                        <Button className="w-fit mx-auto text-white  pointer hover:bg-[#181818]" variant={Ghost} >Save</Button>
                    </DialogContent>
                </Dialog>
            </div>

            <div className="w-full h-full">
                <img className="w-full max-h-[80vh] object-cover" src={post?.postImage} alt="" />
            </div>

            <div className="flex justify-between items-center my-2">
                <div className="flex gap-2">
                    <Heart onClick={postLikeUnlike} className={`transition-colors cursor-pointer ${isLiked ? "fill-red-600 stroke-red-600" : ""}`}></Heart>
                    <MessageCircle onClick={() => setCommentOpen(true)} className="pointer">
                    </MessageCircle>
                    <Send className="pointer" />
                </div>
                <Bookmark className="pointer"></Bookmark>
            </div>
            <div className="flex flex-col gap-2">
                {post.likes.length > 0 && <span className="font-medium block pointer">{post?.likes?.length}</span>}
                <p>
                    <span className="font-semibold mr-1">
                        {post?.author?.username}
                    </span>
                    <span>
                        {post?.caption}
                    </span>
                </p>
                <p>
                    {post.comments.length > 0 && <button button onClick={() => setCommentOpen(true)} className="pointer">View all {post.comments.length} comments</button>}
                </p>
                <Comment post={post} open={commetOpen} setCommentOpen={setCommentOpen}  ></Comment>
                <div className="flex justify-between items-center">
                    <input  value={commetText} onChange={(e) => setCommentText(e.target.value)} type="text" placeholder="add a comment" className="focus:outline-none w-full" />
                    {commetText.length > 0 && <button onClick={(e) => addComment(e)} className="pointer text-red-700" >Post</button>}
                </div>
            </div>
        </div >
    )
}


export default Posts