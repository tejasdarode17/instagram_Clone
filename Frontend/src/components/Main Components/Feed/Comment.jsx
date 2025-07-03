import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar"
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"
import { Ghost, Heart, MoreHorizontal, } from "lucide-react"
import axios from "axios"
import { DialogClose } from "@radix-ui/react-dialog"
import { useDispatch } from "react-redux"
import { deletePostComment } from "@/Redux/postSlice"


const Comment = ({ open, setCommentOpen, post }) => {
    const dispatch = useDispatch()
    async function deleteComment(commentID) {
        try {
            const response = await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/user/delete/comment/${commentID}`, {
                withCredentials: true
            })
            const data = response.data
            dispatch(deletePostComment({ commentID, postID: post._id }))
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <Dialog open={open} onOpenChange={setCommentOpen}>
            <DialogContent className="flex border-none gap-0 outline-none min-w-[70vw] min-h-[80vh] max-h-[80vh] p-0 overflow-hidden">
                {/*Left - image*/}
                <div className="flex-1  flex items-center justify-center">
                    <img
                        src={post?.postImage}
                        alt="Post"
                        className="object-contain max-h-full max-w-full"
                    />
                </div>

                {/* Righ comments & caption */}
                <div className="flex-1  flex flex-col p-4 overflow-y-auto">
                    {/* author row */}
                    <div className="flex items-center gap-2 mb-2">
                        <Avatar>
                            <AvatarImage
                                className="w-8 h-8 rounded-full"
                                src={post?.author?.profilePicture}
                            />
                            <AvatarFallback>CN</AvatarFallback>
                        </Avatar>
                        <h2 className="text-sm font-semibold">{post?.author.username}</h2>
                    </div>

                    {/* caption */}
                    <div className="text-sm pl-10 mb-5 flex gap-2">
                        <p className="font-semibold">{post?.author?.username}</p>
                        <p>{post?.caption}</p>
                    </div>

                    {/* comments */}
                    <div className="flex flex-col gap-3">
                        {post?.comments?.map(c => (
                            <div className="flex items-center justify-between">
                                <div key={c._id} className="flex items-center gap-3">
                                    <Avatar>
                                        <AvatarImage
                                            className="w-8 h-8 rounded-full"
                                            src={c?.author?.profilePicture}
                                        />
                                        <AvatarFallback>CN</AvatarFallback>
                                    </Avatar>
                                    <p className="font-medium text-sm">{c?.author?.username}</p>
                                    <p className="text-sm">{c?.text}</p>
                                    <Dialog >
                                        <DialogTrigger asChild>
                                            <MoreHorizontal className='pointer'></MoreHorizontal>
                                        </DialogTrigger>
                                        <DialogContent className='w-50 bg-[#262626] outline-none border-none p-0 m-0 gap-0' >
                                            <DialogClose asChild>
                                                <Button onClick={() => deleteComment(c._id)} className='w-full h-full hover:bg-[#201f1f] text-red-600 pointer' variant={Ghost}>Delete</Button>
                                            </DialogClose>
                                            <DialogClose asChild>
                                                <Button className='w-full h-full hover:bg-[#201f1f] text-red-600 pointer' variant={Ghost}>Report</Button>
                                            </DialogClose>
                                        </DialogContent>
                                    </Dialog>
                                </div>
                                <Heart className="w-4 h-4 cursor-pointer" />
                            </div>
                        ))}
                    </div>
                </div>
            </DialogContent>
        </Dialog>

    )
}

export default Comment
