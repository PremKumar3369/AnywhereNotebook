import "./App.css";
import { Routes, Route } from "react-router-dom";
import Home from "./components/Home";
import About from "./components/About";
import Navbar from "./components/Navbar";
import "bootstrap/dist/css/bootstrap.min.css";
import NoteSate from "./context/Notes/NoteState";
import Alert from "./components/Alert";

function App() {
  return (
    <>
      <NoteSate>
        <Navbar />
        {/* <Alert message="Success Container"/> */}
        <div className="container">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
          </Routes>
        </div>
      </NoteSate>
    </>
  );
}

export default App;
