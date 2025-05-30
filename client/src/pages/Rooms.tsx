import React, { useEffect } from 'react'
import { db } from '@/lib/db'
import { useNavigate } from 'react-router-dom'
const Rooms = () => {
    const navigate = useNavigate()
    useEffect(() => {
        const loadProfile = async()=>{
            const saved = await db.profiles.get('me')
            if(!saved){
                alert('User not save and redirecting to profile page')
                navigate('/profile')
            }
        }
        loadProfile()
    }, [])
    
  return (
    <div>
        <h1 className='text-white'>This is rooms</h1>
    </div>
  )
}

export default Rooms
