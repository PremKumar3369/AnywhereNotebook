import React from "react";
import { Link, useLocation } from "react-router-dom";
import "./Navbar.css";

const Navbar = () => {
  const location = useLocation();

  return (
    <nav className="navbar">
      <div className="navbar__logo">AnyWhereNoteBook</div>

      <ul className="navbar__menu">
        <li>
          <Link
            to="/"
            className={`navbar__link ${location.pathname === "/" ? "active" : ""}`}
          >
            Home
          </Link>
        </li>
        <li>
          <Link
            to="/about"
            className={`navbar__link ${location.pathname === "/about" ? "active" : ""}`}
          >
            About
          </Link>
        </li>
      </ul>

      <div className="navbar__search">
        <input type="text" placeholder="Search..." />
      </div>
    </nav>
  );
};

export default Navbar;
