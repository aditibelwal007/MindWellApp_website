import React from "react";
import { Routes, Route } from "react-router-dom";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import MoodTracker from "./pages/MoodTracker";
import Chat from "./pages/Chat";
import Games from "./pages/Games";
import Mindfulness from "./pages/Mindfulness";
import Navbar from "./components/Navbar";

// ✅ Use shadcn toaster (your custom one)
import { Toaster } from "@/components/ui/toaster";

function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      {/* ✅ Correct Toaster */}
      <Toaster />

      <div className="p-4">
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/mood-tracker" element={<MoodTracker />} />
          <Route path="/chat" element={<Chat />} />
          <Route path="/games" element={<Games />} />
          <Route path="/mindfulness" element={<Mindfulness />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
