import React from "react";
import { NavLink } from "react-router-dom";

function Hero() {
  return (
    <div className="hero-wrapper">

      {/* LEFT TEXT AREA */}
      <div className="hero-content">
        <h2 className="hero-title">
          Welcome to <span className="brand-name">Surgical</span>, a modern
          platform designed to simplify surgical management and patient care
          coordination.
        </h2>

        <ul className="hero-list">
          <li>
            Our goal is to bridge the gap between healthcare professionals and
            patients through technology that ensures efficiency, accuracy, and
            better health outcomes.
          </li>
          <br />
          <li>
            Whether you’re scheduling procedures, managing patient records, or
            analyzing data, Surgical provides secure, seamless, and intuitive
            tools that help you focus on what truly matters — saving lives.
          </li>
        </ul>

        <div className="hero-buttons">
          <NavLink to="/login" className="btn btn-primary">
            Login
          </NavLink>
          <NavLink to="/register" className="btn btn-secondary">
            Register
          </NavLink>
        </div>
      </div>

      {/* RIGHT IMAGE */}
      <div className="hero-image-wrapper">
        <img
          src="https://media.istockphoto.com/id/2187596922/photo/portrait-of-happy-smiling-healthcare-team-looking-at-camera.jpg?s=1024x1024&w=is&k=20&c=TVmxmIANyn09Nr43qf5vp3fhfBmetPlG8BpRk6B_iCE="
          alt="Surgeon"
          className="hero-image"
        />
      </div>

    </div>
  );
}

export default Hero;
