import axios from 'axios';
import React, { useEffect } from 'react'
import { useParams } from 'react-router-dom'

const Profile = () => {

    const { id } = useParams();

    async function getUserProfileData() {
        try {
            const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/user/${id} `)
            const data = response.data
            console.log(data);

        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        getUserProfileData()
    }, [id])

    return (
        <div className='h-[100vh]'>

        </div>
    )
}

export default Profile
