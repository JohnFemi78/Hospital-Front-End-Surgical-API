import React, { useContext } from "react";
import { FaHandHoldingMedical } from "react-icons/fa";
import { NavLink } from "react-router-dom";
import { storeContext } from "../context/storeContext";

function NavBar() {
  const { isAuth } = useContext(storeContext);

  return (
    <nav className="navbar">
      <div className="logoContainer">
        <p className="nav-pix">Surgical</p>
        <FaHandHoldingMedical className="logoIcon" />
      </div>

      <ul className="navLinks">
        <li>
          <NavLink
            to="/"
            className={({ isActive }) =>
              isActive ? "nav-item active" : "nav-item"
            }
          >
            Home
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/about"
            className={({ isActive }) =>
              isActive ? "nav-item active" : "nav-item"
            }
          >
            About
          </NavLink>
        </li>

        {isAuth ? (
          <li>
            <NavLink
              to="/dashboard"
              className={({ isActive }) =>
                isActive ? "nav-item active" : "nav-item"
              }
            >
              Dashboard
            </NavLink>
          </li>
        ) : null}

        {isAuth ? ( <>  
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
                isActive ? "nav-item active" : "nav-item"
              }
            >
              Sign Out
            </NavLink>
          </li>
        </>

          
        ) : null}
      </ul>
    </nav>
  );
}

export default NavBar;
