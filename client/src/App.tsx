import { Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import { ThemeProvider } from "./components/theme-provider";
import  ProfileSetup  from "@/pages/ProfileSetup";
import Rooms from "./pages/Rooms";

function App() {

  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/profile" element={<ProfileSetup/>}/>
        <Route path="/rooms" element={<Rooms/>}/>
      </Routes>
    </ThemeProvider>
  )
}

export default App
