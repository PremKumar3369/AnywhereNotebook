// src/components/auth/VerifyOtp.js
import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import "./BrutalistInput.css";


const VerifyOtp = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const email = location.state?.email || "";

  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleReset = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      const baseURL = process.env.REACT_APP_API_BASE_URL;
const response = await axios.post(`${baseURL}/api/auth/reset-password`, {
  email,
  otp,
  newPassword,
});

     

      setMessage("✅ Password reset successful. Redirecting to login...");
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      console.error(err);
      setMessage(err.response?.data?.error || "❌ Failed to reset password");
    }
  };

  return (
    <div className="center-wrapper">
      <form className="brutalist-container" onSubmit={handleReset}>
        <label className="brutalist-label">6 Digit-OTP</label>
        <input
          type="text"
          className="brutalist-input smooth-type"
          placeholder="ex : 311566, 111658"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          required
           autoComplete="new-password" 
        />

        <label className="brutalist-label">Password</label>
        <input
          type="password"
          className="brutalist-input smooth-type"
          placeholder="Enter new password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          required
           autoComplete="new-password" 
        />

        <button type="submit" className="brutalist-button">Reset Password</button>

       {message && (
  <p className="comic-message">{message}</p>
)}

      </form>
    </div>
  );
};

export default VerifyOtp;
