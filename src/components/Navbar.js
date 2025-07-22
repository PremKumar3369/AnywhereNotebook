import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "./Navbar.css";

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const isLoggedIn = localStorage.getItem("token");

  const toggleMenu = () => setIsOpen(!isOpen);
  const closeMenu = () => setIsOpen(false);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <nav className={`navbar ${isLoggedIn ? "center-align" : "left-align"}`}>
      <div className="navbar__logo">AnyWhereNoteBook</div>

      <div className="navbar__hamburger" onClick={toggleMenu}>
        <div className={`bar ${isOpen ? "rotate1" : ""}`}></div>
        <div className={`bar ${isOpen ? "hide" : ""}`}></div>
        <div className={`bar ${isOpen ? "rotate2" : ""}`}></div>
      </div>

      <ul className={`navbar__menu ${isOpen ? "open" : ""}`}>
        <li>
          <Link to="/" className={`navbar__link ${location.pathname === "/" ? "active" : ""}`} onClick={closeMenu}>
            Home
          </Link>
        </li>
        <li>
          <Link to="/about" className={`navbar__link ${location.pathname === "/about" ? "active" : ""}`} onClick={closeMenu}>
            AskUrAI
          </Link>
        </li>
        {isLoggedIn ? (
          <li>
            <button className="navbar__link logout-btn" onClick={handleLogout}>Logout</button>
          </li>
        ) : (
          <>
            <li>
              <Link to="/login" className={`navbar__link ${location.pathname === "/login" ? "active" : ""}`} onClick={closeMenu}>
                Login
              </Link>
            </li>
          </>
        )}
      </ul>

      
    </nav>
  );
};

export default Navbar;
