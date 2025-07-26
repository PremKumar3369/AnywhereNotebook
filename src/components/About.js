import React from "react";
import { Link } from "react-router-dom";
import "./About.css";
import AnimatedHeading from "./AnimatedHeading";

const panels = [
  {
    title: "About AnyWhereNotebook",
    text: `Designed with a clean, user-friendly interface, AnyWhereNotebook ensures a distraction-free writing experience. Your notes are stored securely and accessible across all your devices in real-time. It supports tagging, rich-text formatting, and powerful search to help you find what you need instantly. With built-in authentication and OTP-based password reset, your data stays protected. Whether it's for study, work, or daily journaling—AnyWhereNotebook adapts to your workflow.`,
    color: "#ff0202ff",
    Textcolor : "black"
  },
  {
    title: "Minimal UI, Maximum Brain Power!",
    text: `Designed with a streamlined interface and AI assistance to keep your ideas flowing.`,
    color: "#f7941d",
    Textcolor : "blue"
  },
  {
    title: "🌟 Why We Built This",
    text: `AskAIChat is your built‑in assistant that can answer your queries from your note data only.`,
    color: "#8ec63f",
    Textcolor : "white"
  },
  {
    title: "🛠️ Built With",
    text: `React.js, Node.js + Express, MongoDB, Xenova / Transformers AI Chat Assistant`,
    color: "#27aae2",
    Textcolor : "orange"
  },
];

const About = () => {
  const token = localStorage.getItem("token");

  if (!token) {
    return (
      <div
        className="container d-flex justify-content-center align-items-center flex-column min-vh-100 text-center"
        style={{ minHeight: "100vh", transform: "translateY(-100px)" }}
      >
        <AnimatedHeading title={`Please Login\nTo View About Page`} />
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
    <div className="comic-stack">
      {panels.map((p, idx) => (
        <div
          key={idx}
          className={`comic-panel panel-${idx + 1}`}
          style={{ backgroundColor: p.color, color: p.Textcolor }}
        >
          <h2>{p.title}</h2>
          <p>{p.text}</p>
        </div>
      ))}
    </div>
  );
};

export default About;
