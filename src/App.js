import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./components/Home";
import About from "./components/About";
import Navbar from "./components/Navbar";
import "bootstrap/dist/css/bootstrap.min.css";
import NoteSate from "./context/Notes/NoteState";
import Alert from "./components/Alert";
import Login from "./components/Login";
import { AlertProvider } from "./context/AlertContext";
import { UIProvider } from "./context/UIContext";
import "nprogress/nprogress.css";
import RouteLoader from "./components/RouteLoader";
import NProgress from "nprogress";
import "./App.css";
import "nprogress/nprogress.css";
import ForgotPassword from "./components/auth/ForgotPassword";
import VerifyOtp from "./components/auth/VerifyOtp";
import CookieConsent from "./components/CookieConsent";

NProgress.configure({
  trickle: true,
  trickleRate: 0.2,
  trickleSpeed: 300,
  showSpinner: false,
});

function App() {
  return (
    <UIProvider>
      <AlertProvider>
        <NoteSate>
          <Alert />
          <Navbar />
          <RouteLoader />
          <div className="container">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/login" element={<Login />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/verify-otp" element={<VerifyOtp />} />
            </Routes>
          </div>
        </NoteSate>
      </AlertProvider>
       <CookieConsent/>
    </UIProvider>
  );
}

export default App;
