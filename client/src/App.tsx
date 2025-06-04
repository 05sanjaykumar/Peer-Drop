import { Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import { ThemeProvider } from "./components/theme-provider";
import  ProfileSetup  from "@/pages/ProfileSetup";
import Rooms from "./pages/Rooms";
import RoomPage from "./pages/Room"

function App() {

  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/profile" element={<ProfileSetup/>}/>
        <Route path="/rooms" element={<Rooms/>}/>
        <Route path="/room/:id" element={<RoomPage/>} />
      </Routes>
    </ThemeProvider>
  )
}

export default App
