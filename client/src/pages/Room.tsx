// pages/Room.tsx
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { db, type Room } from "@/lib/db";
import { v4 as uuidv4 } from "uuid";

type Profile = {
  id: string;
  name: string;
  lastActive: Date;
};

export default function RoomPage() {
  const { id: roomId } = useParams();
  const navigate = useNavigate();
  const [room, setRoom] = useState<Room | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);

  useEffect(() => {
    const init = async () => {
      const me = await db.profiles.get("me");
      if (!me) {
        alert("Please set your profile first.");
        navigate("/profile");
        return;
      }
      setProfile(me);

      const foundRoom = await db.rooms.get(roomId!);
      console.log('Room founded:',foundRoom)
      if (!foundRoom) {
        alert("Room not found!");
        navigate("/rooms");
        return;
      }

      // Add self to participants if not already in
      if (!foundRoom.participants.includes(me.id)) {
        foundRoom.participants.push(me.id);
        await db.rooms.put(foundRoom);
      }

      setRoom(foundRoom);
    };

    init();
  }, [roomId, navigate]);

  if (!room || !profile) return <p className="text-white">Loading...</p>;

  return (
    <div className="p-6 space-y-4 text-white">
      <h1 className="text-2xl font-bold">Room: {room.name}</h1>
      <h2 className="text-xl">Participants:</h2>
      <ul className="list-disc list-inside">
        {room.participants.map((p) => (
          <li key={p}>{p === profile.id ? `${p} (You)` : p}</li>
        ))}
      </ul>
      {/* Placeholder for signaling or WebRTC components */}
    </div>
  );
}
