// pages/Rooms.tsx
import  { useEffect, useState } from "react";
import { db } from "@/lib/db";
import RoomSidebar from "@/components/RoomSidebar";
import { useNavigate } from "react-router-dom";

const Rooms = () => {
  const [profileId, setProfileId] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const loadProfile = async () => {
      const profile = await db.profiles.get("me");
      if (!profile) {
        alert("Redirecting to profile setup.");
        navigate("/profile");
      } else {
        setProfileId(profile.id);
      }
    };
    loadProfile();
  }, []);

  if (!profileId) return null;

  return (
    <div className="flex">
      <RoomSidebar currentUserId={profileId} />
      <div className="flex-1 p-6">
        <h1 className="text-2xl font-bold">Select or Create a Room</h1>
      </div>
    </div>
  );
};

export default Rooms;
