import React from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { FiCamera, FiArrowLeft } from 'react-icons/fi';
import { Button } from '../../ui/button';
import { Loader2, } from 'lucide-react';
import { updateUser } from '@/Redux/authSlice';



const EditProfile = () => {

  const { id } = useParams()
  const userProfile = useSelector(state => state.auth.userProfile)
  const [loading, setLoading] = useState(false)
  const [userInput, setUserInput] = useState({
    name: "",
    bio: "",
    image: null
  })

  const dispatch = useDispatch();
  const navigate = useNavigate()

  useEffect(() => {
    if (userProfile) {
      setUserInput({
        name: userProfile.name || "",
        bio: userProfile.bio || "",
        profilePicture: userProfile.profilePicture || null
      });
    }
  }, [userProfile]);

  async function editUserData(e) {
    e.preventDefault()
    try {
      setLoading(true)
      const formData = new FormData()
      formData.append("name", userInput.name);
      formData.append("bio", userInput.bio);
      formData.append("profilePicture", userInput.profilePicture);

      const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/user/edit/${id}`, formData, { withCredentials: true })
      const data = response?.data

      console.log(data);
      navigate(`/profile/${id}`)
      setLoading(false)
      dispatch(updateUser(data?.user))

    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      {/* Header */}
      <div className="border-b border-gray-800 py-4 px-4 flex items-center justify-between sticky top-0 bg-gray-900 z-10">
        <button
          onClick={() => navigate(-1)}
          className="p-2 rounded-full hover:bg-gray-800"
        >
          <FiArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="text-xl font-semibold">Edit Profile</h1>
        <div className="w-9"></div> {/* Spacer for alignment */}
      </div>

      <div className="max-w-md mx-auto px-4 py-8">
        {/* Profile Picture */}
        <div className="flex flex-col items-center mb-8">
          <label
            htmlFor="image"
            className="relative group cursor-pointer w-28 h-28 rounded-full border-2 border-gray-700 overflow-hidden hover:border-pink-500 transition-all duration-200"
          >
            {userInput.profilePicture ? (
              <img
                className="w-full h-full object-cover"
                src={
                  typeof userInput.profilePicture === "string"
                    ? userInput.profilePicture || "https://cdn-icons-png.flaticon.com/512/149/149071.png"
                    : URL.createObjectURL(userInput.profilePicture)
                }
                alt="Profile preview"
              />
            ) : (
              <div className="w-full h-full bg-gray-700 flex items-center justify-center">
                <img
                  src="https://cdn-icons-png.flaticon.com/512/149/149071.png"
                  alt="Default profile"
                  className="w-3/4 h-3/4 opacity-70"
                />
              </div>
            )}
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity duration-300">
              <FiCamera className="w-6 h-6 text-white" />
            </div>
          </label>
          <input
            type="file"
            id="image"
            className="hidden"
            accept="image/*"
            onChange={(e) => setUserInput(prev => ({ ...prev, profilePicture: e.target.files[0] }))}
          />
          <span className="mt-3 text-white font-medium text-sm">Change Photo</span>
        </div>

        {/* Edit Form */}
        <form onSubmit={editUserData} className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-400">Name</label>
            <input
              className="w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 focus:border-pink-500 focus:ring-1 focus:ring-pink-500/50 transition-all duration-200 placeholder-gray-500"
              type="text"
              value={userInput.name}
              onChange={(e) => setUserInput(prev => ({ ...prev, name: e.target.value }))}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-400">Bio</label>
            <textarea
              className="w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 focus:border-pink-500 focus:ring-1 focus:ring-pink-500/50 transition-all duration-200 placeholder-gray-500 resize-none h-32"
              value={userInput.bio}
              placeholder="Tell us about yourself..."
              onChange={(e) => setUserInput(prev => ({ ...prev, bio: e.target.value }))}
            />
            <p className="text-xs text-gray-500 text-right">
              {userInput.bio.length}/150
            </p>
          </div>

          {
            loading ? (
              <Button variant='ghost' className="w-full" disabled={loading}>
                <Loader2 className="animate-spin pointer" />
                Saving
              </Button>
            ) : (
              <Button variant="ghost" className='border w-full pointer  border-gray-400 px-4 py-1 text-sm pointer' type="submit" >Save</Button>
            )
          }
        </form>
      </div>
    </div >
  )
}

export default EditProfile
