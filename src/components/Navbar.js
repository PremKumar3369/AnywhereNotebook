import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FiLogOut, FiLogIn } from "react-icons/fi";
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
     <div className="navbar__logo-wrapper">
  <div className="navbar__logo">AnyWhereNoteBook</div>
  <div className="ghost">
    <div></div>
    <div></div>
    <div></div>
    <div></div>
    <div></div>
  </div>
</div>


      <div
        className={`navbar__hamburger ${isOpen ? "open" : ""}`}
        onClick={toggleMenu}
      >
        <div className="bar"></div>
        <div className="bar"></div>
        <div className="bar"></div>
      </div>

      <ul className={`navbar__menu ${isOpen ? "open" : ""}`}>
        <li>
          <Link
            to="/"
            className={`navbar__link ${location.pathname === "/" ? "active" : ""}`}
            onClick={closeMenu}
          >
            Home
          </Link>
        </li>
        <li>
          <Link
            to="/about"
            className={`navbar__link ${location.pathname === "/about" ? "active" : ""}`}
            onClick={closeMenu}
          >
            About
          </Link>
        </li>
        <li>
          <Link
  to="/demo"
  className={`navbar__link ${location.pathname === "/demo" ? "active" : ""}`}
  onClick={closeMenu}
>
  Demo
</Link>
        </li>
        {isLoggedIn ? (
          <li>
            <button className="navbar__link logout-btn" onClick={handleLogout}>
              <FiLogOut style={{ marginRight: "6px" }} /> Logout
            </button>
          </li>
        ) : (
          <li>
            <Link
              to="/login"
              className={`navbar__link login-link ${location.pathname === "/login" ? "active" : ""}`}
              onClick={closeMenu}
            >
              <FiLogIn style={{ marginRight: "6px" }} /> Login
            </Link>
          </li>
        )}
      </ul>
    </nav>
  );
};

export default Navbar;
