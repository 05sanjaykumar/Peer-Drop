// components/RoomSidebar.tsx
import { useEffect, useState } from "react";
import { db, type Room } from "@/lib/db";
import { useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";

export default function RoomSidebar({ currentUserId }: { currentUserId: string }) {
    const [rooms, setRooms] = useState<Room[]>([]);
    const [roomName, setRoomName] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
    const loadRooms = async () => {
      const allRooms = await db.rooms.toArray();
      setRooms(allRooms);
    };
    loadRooms();
  }, []);

    const createRoom = async()=>{
        if (!roomName.trim()) return;

        const newRoom: Room = {
            id: uuidv4(),
            name: roomName,
            createdBy: currentUserId,
            participants: [currentUserId],
            createdAt: new Date()
        };

        await db.rooms.put(newRoom);
        console.log('new room created', newRoom)
        setRooms(await db.rooms.toArray());
        setRoomName("");
    };

    const deleteRoom = async(id: string) =>{
        await db.rooms.delete(id);
        setRooms(await db.rooms.toArray());
    }

    return (
        <div className=" bg-gray-100 h-screen p-4 border-r space-y-4">
             <h2 className="text-xl font-bold">Rooms</h2>
             <div className="flex gap-2">
                <input 
                className="flex-1 px-2 py-1 border text-black"
                value={roomName}
                onChange={(e)=>setRoomName(e.target.value)}
                placeholder="Enter room name"
                />
              <button onClick={createRoom} className="bg-green-400 text-white px-2 py-1 rounded-md">
                Create Room
              </button>

             </div>
             <ul className="space-y-2">
                {rooms.map((room)=>(
                    <li key={room.id} className="flex justify-between items-center bg-white px-2 py-1 rounded shadow">
                        <span
                        onClick={()=>navigate(`/room/${room.id}`)}
                        >
                            {room.name}
                        </span>
                        <button
                        onClick={() => deleteRoom(room.id)}
                        className="text-red-500 font-bold"
                        >
                            X
                        </button>
                    </li>
                ))}
             </ul>
        </div>
    )
}