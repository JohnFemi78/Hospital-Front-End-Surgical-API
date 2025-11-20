import React, { useContext, useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { storeContext } from "../context/storeContext";

function Sidebar() {
  const { isAuth } = useContext(storeContext);
  const location = useLocation();
  const [open, setOpen] = useState(false);

  // Hide sidebar if not authenticated or not on dashboard pages
  if (
    !isAuth ||
    (!location.pathname.startsWith("/dashboard") &&
      !location.pathname.startsWith("/profile"))
  ) {
    return null;
  }

  return (
    <>
      {/* MOBILE TOGGLE BUTTON */}
      <button
        className="sidebar-toggle-btn"
        onClick={() => setOpen(!open)}
      >
        ☰
      </button>

      <div className={`sidebar ${open ? "open" : ""}`}>
        <h2 className="sidebar-title">Menu</h2>
        <ul className="sidebar-links">
          <li>
            <NavLink
              to="/dashboard"
              className={({ isActive }) =>
                isActive ? "active-link" : "sidebar-link"
              }
            >
              Dashboard
            </NavLink>
          </li>

          <li>
            <NavLink
              to="/profile"
              className={({ isActive }) =>
                isActive ? "active-link" : "sidebar-link"
              }
            >
              Profile
            </NavLink>
          </li>

          <li>
            <NavLink
              to="/signOut"
              className={({ isActive }) =>
                isActive ? "active-link" : "sidebar-link"
              }
            >
              Sign Out
            </NavLink>
          </li>
        </ul>
      </div>
    </>
  );
}

export default Sidebar;
