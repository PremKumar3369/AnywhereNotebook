import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./components/Home";
// import About from "./components/About";
import Navbar from "./components/Navbar";
import "bootstrap/dist/css/bootstrap.min.css";
import NoteSate from "./context/Notes/NoteState";
import Alert from "./components/Alert"; 
import Login from "./components/Login";
// import Signup from "./components/Signup";
import { AlertProvider } from "./context/AlertContext";
import AskAIChat from './components/AskAIChat';

function App() {
  return (
    <AlertProvider>
      <NoteSate>
        <Navbar />
        <Alert />
        <div className="container">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<AskAIChat />} />
            <Route path="/login" element={<Login />} />
            {/* <Route path="/signup" element={<Signup />} /> */}
          </Routes>
        </div>
      </NoteSate>
    </AlertProvider>
  );
}

export default App;
