import React from "react";
import Notes from "./Notes";
import { Link } from "react-router-dom";

function Home() {
  const token = localStorage.getItem("token");

  if (!token) {
    return (
      <div style={{ textAlign: "center", marginTop: "50px" }}>
        <h2>🔒 Please login to use AnywhereNotebook.</h2>
        <Link
          to="/Login"
          style={{
            marginTop: "15px",
            display: "inline-block",
            padding: "10px 20px",
            backgroundColor: "#F0EDCC",
            color: "#02343F",
            border: "2px solid #000",
            textDecoration: "none",
            fontWeight: "bold",
            boxShadow: "2px 2px 0 #000",
            transition: "all 0.2s ease",
          }}
        >
          Go to Login
        </Link>
      </div>
    );
  }

  return (
    <>
      <Notes />
    </>
  );
}

export default Home;
