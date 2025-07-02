import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar"
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"
import { Bookmark, Ghost, Heart, MessageCircle, MoreHorizontal, Send } from "lucide-react"
import { FaRegHeart, FaRegComment } from "react-icons/fa";
import { useState } from "react"
import { Input } from "@/components/ui/input";

const Comment = ({ open, setCommentOpen }) => {
    return (
        <div>
            <Dialog open={open}>
                <DialogContent onInteractOutside={() => setCommentOpen(false)}>
                    <h1>Hello World</h1>
                    <h1>Hello World</h1>
                    <h1>Hello World</h1>
                    <h1>Hello World</h1>
                    <h1>Hello World</h1>
                    <h1>Hello World</h1>
                    <h1>Hello World</h1>
                    <h1>Hello World</h1>
                </DialogContent>
            </Dialog>

        </div>
    )
}

export default Comment
