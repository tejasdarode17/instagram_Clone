import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar"
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"
import { Ghost, MoreHorizontal } from "lucide-react"
import { useState } from "react"

const Posts = () => {
    return (
        <div className="flex bg-[#fff] flex-col gap-5">
            {
                [1, 3, 4, 5, 6, 7,].map((p) => (
                    <div>
                        <Post></Post>
                    </div>
                ))
            }
        </div>
    )
}


export default Posts

export const Post = () => {
    return (
        <div className="w-full shadow-2xl border my-8 max-w-sm">
            <div className="flex items-center my-1 justify-between">
                <div className="flex gap-2 items-center">
                    <Avatar>
                        <AvatarImage className="w-8 h-8 rounded-full" src="https://github.com/shadcn.png" />
                        <AvatarFallback>CN</AvatarFallback>
                    </Avatar>
                    <h1>tejasdarode17</h1>
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
                <img className="" src="https://images.unsplash.com/photo-1748392029321-58793571f850?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" alt="" />
            </div>
        </div>
    )
}


