//pages/Rooms.tsx
import React, { use, useEffect, useState } from 'react'
import { db } from '@/lib/db'
import { useNavigate } from 'react-router-dom'
import { v4 as uuidv4 } from 'uuid'
import { Button } from '@/components/ui/button'

const Rooms = () => {
    const navigate = useNavigate()
    const [profile, setProfile] = useState<any>(null)
    const [roomName, setRoomName] = useState("")
    useEffect(() => {
        const loadProfile = async()=>{
            const saved = await db.profiles.get('me')
            if(!saved){
                alert('User not save and redirecting to profile page')
                navigate('/profile')
            }
            else
            {
                setProfile(saved)
            }
        }
        loadProfile()
    }, [])

    const handleCreateRoom = async ()=>{
        if (!roomName || !profile) return

        const newRoom = {
            id: uuidv4(),
            name: roomName,
            createdBy: profile.id,
            participants: [profile.id],
            createdAt: new Date()
        }

        await db.rooms.put(newRoom)
        console.log("Room created:", newRoom)
        navigate(`/room/${newRoom.id}`)
    }
    
  return (
    <div className="p-6 max-w-md mx-auto bg-white rounded-xl shadow space-y-4">
      <h2 className="text-xl font-bold">Welcome {profile?.name}, Create or Join a Room</h2>
      <input
        className="border px-2 py-1 w-full text-black"
        placeholder="Enter room name"
        value={roomName}
        onChange={(e) => setRoomName(e.target.value)}
      />
      <Button onClick={handleCreateRoom}>Create Room +</Button>
    </div>
  )
}

export default Rooms
