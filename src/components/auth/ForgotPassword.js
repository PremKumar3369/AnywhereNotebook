// src/components/auth/ForgotPassword.js
import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./BrutalistInput.css";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      const baseURL = process.env.REACT_APP_API_BASE_URL;
const response = await axios.post(`${baseURL}/api/auth/send-otp`, { email });

      setMessage("OTP sent to your email");
      // Navigate to OTP verify page with email in state
      navigate("/verify-otp", { state: { email } });
    } catch (err) {
      console.error(err);
      setMessage(err.response?.data?.error || "Failed to send OTP");
    }
  };

  return (
    <>
   <div className="center-wrapper">
    
  <form className="brutalist-container" onSubmit={handleSubmit}>
    <label className="brutalist-label">Email</label>
    <input
      type="email"
      className="brutalist-input smooth-type"
      placeholder="Enter your email"
      required
      value={email}
      onChange={(e) => setEmail(e.target.value)}
    />
    

    <button type="submit" className="brutalist-button">Send OTP</button>

   {message && (
  <p className="comic-message">{message}</p>
)}

  </form>
</div>
</>
  );
};

export default ForgotPassword;
