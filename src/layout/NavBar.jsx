import React, { useContext, useState } from "react";
import { FaHandHoldingMedical } from "react-icons/fa";
import { RxHamburgerMenu } from "react-icons/rx";
import { IoClose } from "react-icons/io5";
import { NavLink } from "react-router-dom";
import { storeContext } from "../context/storeContext";

function NavBar() {
  const { isAuth } = useContext(storeContext);
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => setMenuOpen(!menuOpen);

  return (
    <nav className="navbar">
      {/* Logo */}
      <div className="logo-container">
        <p className="nav-title">Surgical</p>
        <FaHandHoldingMedical className="logo-icon" />
      </div>

      {/* Hamburger Icon (mobile only) */}
      <div className="hamburger" onClick={toggleMenu}>
        {menuOpen ? <IoClose className="hamburger-icon" /> : <RxHamburgerMenu className="hamburger-icon" />}
      </div>

      {/* Links */}
      <ul className={`nav-links ${menuOpen ? "open" : ""}`}>
        <li>
          <NavLink to="/" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"} onClick={toggleMenu}>
            Home
          </NavLink>
        </li>

        <li>
          <NavLink to="/about" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"} onClick={toggleMenu}>
            About
          </NavLink>
        </li>

        {isAuth && (
          <>
            <li>
              <NavLink to="/dashboard" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"} onClick={toggleMenu}>
                Dashboard
              </NavLink>
            </li>

            <li>
              <NavLink to="/profile" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"} onClick={toggleMenu}>
                Profile
              </NavLink>
            </li>

            <li>
              <NavLink to="/signOut" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"} onClick={toggleMenu}>
                Sign Out
              </NavLink>
            </li>
          </>
        )}
      </ul>
    </nav>
  );
}

export default NavBar;
