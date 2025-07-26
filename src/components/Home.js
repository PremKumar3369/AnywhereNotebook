import React from "react";
import Notes from "./Notes";
import { Link } from "react-router-dom";
import "./Home.css";
import AnimatedHeading from "./AnimatedHeading";

function Home() {
  const token = localStorage.getItem("token");

  if (!token) {
    return (
      <div className="container d-flex justify-content-center align-items-center flex-column min-vh-100 text-center"   style={{ minHeight: "100vh", transform: "translateY(-100px)" }}
>
        <AnimatedHeading title={`Please Login\nTo Use AnywhereNotebook`} />
        <Link
          className="btn mt-4"
          to="/Login"
          style={{
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
