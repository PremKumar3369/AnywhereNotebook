// src/components/CookieConsent.js
import React, { useEffect, useState } from "react";
import "./CookieConsent.css";

const FIVE_HOURS_MS = 5 * 60 * 60 * 1000; // 5 hours in milliseconds

const CookieConsent = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return; // Only for logged-in users

    const lastShown = localStorage.getItem("cookieLastShown");
    const now = Date.now();

    if (!lastShown || now - parseInt(lastShown) > FIVE_HOURS_MS) {
      setVisible(true);
    }
  }, []);

  const handleConsent = (accepted) => {
    localStorage.setItem("cookieConsent", accepted ? "accepted" : "declined");
    localStorage.setItem("cookieLastShown", Date.now().toString());
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="comic-cookie-banner">
      <p>🍪 We use cookies to enhance your experience. Accept them?</p>
      <div className="cookie-buttons">
        <button onClick={() => handleConsent(true)}>Accept</button>
        <button onClick={() => handleConsent(false)}>Decline</button>
      </div>
    </div>
  );
};

export default CookieConsent;
