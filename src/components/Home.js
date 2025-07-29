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
          className="button-login"
          to="/Login"
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
