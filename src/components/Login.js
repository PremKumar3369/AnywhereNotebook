import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";
import AlertContext from "../context/AlertContext";

function Login() {
  const [mode, setMode] = useState("login");
  const [creds, setCreds] = useState({ email: "", password: "", name: "" });
  const [passwordError, setPasswordError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showStrength, setShowStrength] = useState(false);
  const navigate = useNavigate();
  const { showAlert } = useContext(AlertContext);

  const validatePassword = (password) => {
    const minLength = /.{8,}/;
    const upper = /[A-Z]/;
    const lower = /[a-z]/;
    const digit = /[0-9]/;
    const special = /[^A-Za-z0-9]/;

    if (!minLength.test(password))
      return "Password must be at least 8 characters.";
    if (!upper.test(password))
      return "Must contain at least one uppercase letter.";
    if (!lower.test(password))
      return "Must contain at least one lowercase letter.";
    if (!digit.test(password)) return "Must contain at least one number.";
    if (!special.test(password))
      return "Must contain at least one special character.";

    return "";
  };

  const getPasswordStrength = (password) => {
    let score = 0;
    if (password.length >= 8) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[a-z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;

    if (score <= 2) return "weak";
    if (score === 3 || score === 4) return "medium";
    return "strong";
  };

  const onChange = (e) => {
    const { name, value } = e.target;
    setCreds({ ...creds, [name]: value });

    if (mode === "signup" && name === "password") {
      const error = validatePassword(value);
      setPasswordError(error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (mode === "signup") {
      const error = validatePassword(creds.password);
      if (error) {
        setPasswordError(error);
        showAlert(error, "danger");
        return;
      }
    }

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
        json = { authdata: raw };
      }

      if (
        (response.status === 200 || response.status === 201) &&
        json.authdata &&
        typeof json.authdata === "string"
      ) {
        localStorage.setItem("token", json.authdata);
        showAlert("Welcome!", "success");
        navigate("/");
      } else {
        showAlert("Invalid Email or Password", "danger");
      }
    } catch (err) {
      console.error("Fetch Error:", err);
      alert("Network issue or server error.");
    }
  };

  const strength = getPasswordStrength(creds.password);
  const strengthPercentage = {
    weak: "33%",
    medium: "66%",
    strong: "100%",
  }[strength];

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
            <div className="password-container">
              <input
  type={showPassword ? "text" : "password"}
  name="password"
  placeholder="Password"
  value={creds.password}
  onChange={onChange}
  onFocus={() => setShowStrength(true)}
  onBlur={() => setShowStrength(false)}
  required
  autoComplete={mode === "login" ? "current-password" : "new-password"}
/>
              <span
                className="eye-toggle"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? "👁️‍🗨️" : "👁️"}
              </span>
            </div>
            {mode === "login" && (
              <p className="forgot-password-link">
                <a href="/forgot-password">Forgot Password?</a>
              </p>
            )}
            {mode === "signup" && showStrength && (
              <>
                <div className="password-strength-bar">
                  <div
                    className={`password-strength-fill ${strength}`}
                    style={{ width: strengthPercentage }}
                  ></div>
                </div>
                <p className="strength-text">
                  {strength.charAt(0).toUpperCase() + strength.slice(1)}
                </p>
              </>
            )}

            {mode === "signup" && passwordError && (
              <p className="password-error">{passwordError}</p>
            )}
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
