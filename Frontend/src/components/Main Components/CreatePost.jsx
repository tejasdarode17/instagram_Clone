import { Dialog, DialogContent } from '../ui/dialog'
import React, { useEffect, useState } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar"
import { Ghost, Loader2, Upload } from 'lucide-react'
import { Button } from '../ui/button'
import axios from 'axios'
import { toast } from 'sonner'

const CreatePost = ({ open, close }) => {

    const [userInput, setUserInput] = useState({
        caption: "",
        image: null
    })

    const [loading, setLoading] = useState(false)

    useEffect(() => {
        return () => {
            if (userInput.image) {
                URL.revokeObjectURL(userInput.image);
            }
        }
    }, [userInput.image])


    async function addPost() {
        try {
            setLoading(true)
            const formData = new FormData()
            formData.append("caption", userInput.caption)
            formData.append("image", userInput.image)

            const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/post`, formData, { withCredentials: true })
            const data = await response?.data

            toast.success(data?.message)
            close(false)
            setUserInput({
                caption: "",
                image: ""
            })
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false)
        }
    }

    return (
        <div>
            <Dialog open={open}>
                <DialogContent onInteractOutside={() => close(prev => prev = false)}>
                    <div>
                        <div className="flex gap-2 items-center">
                            <Avatar>
                                <AvatarImage className="w-8 h-8 rounded-full" src="https://github.com/shadcn.png" />
                                <AvatarFallback>CN</AvatarFallback>
                            </Avatar>
                            <h1>tejasdarode17</h1>
                        </div>
                    </div>
                    <div>
                        <input
                            type="text-area"
                            placeholder='Write a Caption..'
                            className='w-full focus:outline-none'
                            onChange={(e) => setUserInput((prev) => ({ ...prev, caption: e.target.value }))}
                        />
                        <div>
                            <label htmlFor="image">
                                {

                                    userInput.image ? (
                                        <div className='overflow-x-hidden overflow-y-auto h-[50vh] rounded-xl p-4'>
                                            <img className='w-full' src={URL.createObjectURL(userInput.image)} alt="" />
                                        </div>
                                    ) : (
                                        <div className='w-full pointer h-70 flex flex-col justify-center items-center'>
                                            <Upload className='text-3xl mb-2' />
                                            <p>Click to upload photo</p>
                                            <p className='text-xs mt-1'>PNG, JPG</p>
                                        </div>
                                    )
                                }
                            </label>
                            <input
                                id='image'
                                type="file"
                                className='hidden'
                                accept='.png, .jpeg, .jpg'
                                onChange={(e) => setUserInput((prev) => ({ ...prev, image: e.target.files[0] }))}
                            />
                            <Button onClick={addPost} className='w-full text-white pointer'>
                                {
                                    loading ? <Loader2 className='animate-spin'></Loader2> : "Post"
                                }
                            </Button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    )
}

export default CreatePost
