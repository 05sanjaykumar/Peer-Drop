import { useEffect, useState } from "react";
import { db } from "@/lib/db";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

type Profile = {
  id: string;
  name: string;
  lastActive: Date;
};


export default function ProfileSetup() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [name, setName] = useState("");
  const [editing, setEditing] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const loadProfile = async () => {
      const saved = await db.profiles.get("me");
      setProfile(saved || null);
    };
    loadProfile();
  }, []);

  const saveProfile = async () => {
    const newProfile: Profile = { id: "me", name,lastActive: new Date(Date.now()) };
    await db.profiles.put(newProfile);
    setProfile(newProfile);
    setEditing(false);
    console.log(newProfile)
  };

  const handleEdit = () => {
    setName(profile?.name || "");
    setEditing(true);
  };

  const navigateToRoom = ()=>{
    if (profile)
    {
         navigate("/room");
    }
  }

  return (
    <div className="p-6 max-w-md mx-auto bg-white rounded-xl shadow">
      {profile ? (
        <>
          <h2 className="text-lg font-bold text-black">Hello, {profile.name}!</h2>
          {!editing && (
            <button
              className="mt-4 bg-blue-500 text-white px-4 py-2 rounded"
              onClick={handleEdit}
            >
              Modify Profile
            </button>
          )}
        </>
      ) : (
        <p className="text-red-500">Profile not set. Please enter your name.</p>
      )}

      {(editing || !profile) && (
        <div className="mt-4">
          <input
            className="border px-2 py-1 w-full text-black"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter your name"
          />
          <button
            onClick={saveProfile}
            className="mt-2 bg-green-500 text-white px-4 py-2 rounded"
          >
            Save Profile
          </button>
        </div>
      )}
      <Button onClick={navigateToRoom}>
        Navigate to room
      </Button>
    </div>
  );
}