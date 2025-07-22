import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";
import AlertContext from "../context/AlertContext";


function Login() {
  const [mode, setMode] = useState("login");
  const [creds, setCreds] = useState({ email: "", password: "", name: "" });
  const navigate = useNavigate();
  const { showAlert } = useContext(AlertContext);

  const onChange = (e) => {
    setCreds({ ...creds, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const url =
      mode === "login"
        ? "http://localhost:5000/api/auth/loginUser"
        : "http://localhost:5000/api/auth/createuser";

    const payload =
      mode === "login"
        ? { email: creds.email, password: creds.password }
        : { name: creds.name, email: creds.email, password: creds.password };

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const contentType = response.headers.get("content-type");
      let json;

      if (contentType?.includes("application/json")) {
        json = await response.json();
      } else {
        const raw = await response.text();
        json = { authdata: raw }; // Fallback if response is just a string
      }

      console.log("Parsed Response:", json);

      if (
        (response.status === 200 || response.status === 201) &&
        json.authdata &&
        typeof json.authdata === "string"
      ) {
        localStorage.setItem("token", json.authdata);
        showAlert("Welcome back!", "success");
        navigate("/");
      } else {
        showAlert("Invalid Email Or Password", "danger");
      }
    } catch (err) {
      console.error("Fetch Error:", err);
      alert("Network issue or server error.");
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h2>{mode === "login" ? "Login" : "Sign Up"}</h2>
        <form onSubmit={handleSubmit}>
          {mode === "signup" && (
            <div className="input-layer">
              <input
                type="text"
                name="name"
                placeholder="Name"
                value={creds.name}
                onChange={onChange}
                required
              />
            </div>
          )}
          <div className="input-layer">
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={creds.email}
              onChange={onChange}
              required
              autoComplete="username"
            />
          </div>
          <div className="input-layer">
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={creds.password}
              onChange={onChange}
              required
              autoComplete="current-password"
            />
          </div>
          <button type="submit" className="login-btn">
            {mode === "login" ? "Login" : "Sign Up"}
          </button>
        </form>
        <div className="switch-text">
          {mode === "login" ? (
            <span onClick={() => setMode("signup")}>
              Don’t have an account? <strong>Sign Up</strong>
            </span>
          ) : (
            <span onClick={() => setMode("login")}>
              Already have an account? <strong>Login</strong>
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

export default Login;
