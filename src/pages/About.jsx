// src/pages/About.jsx
import React from "react";
import { NavLink } from "react-router-dom";

function About() {
  return (
    <div className="about-wrapper">

      {/* LEFT SIDE - IMAGE */}
      <div className="about-image-wrapper">
        <img
          src="https://media.gettyimages.com/id/1009969796/photo/working-closely-together-to-keep-you-well.jpg?s=1024x1024&w=gi&k=20&c=WW012dPfKrbXgIjonK3ZlKcG-A1IWlBiQA35L5bPS64="
          alt="medical team"
          className="about-image"
        />
      </div>

      {/* RIGHT SIDE - TEXT */}
      <div className="about-content">
        <h2>About JK Surgical</h2>

        <p>
          Surgical is a modern medical management platform designed to bridge the
          gap between healthcare professionals and patients. It simplifies surgical
          scheduling, patient management, and data coordination — all in one secure,
          user-friendly environment.
        </p>

        <p>
          Our mission is to enhance hospital efficiency, empower doctors, and help
          patients access quality care without stress. Whether you’re consulting,
          planning a surgery, or tracking recovery, <strong>Surgical</strong> ensures
          collaboration is smooth and reliable.
        </p>

        <div className="about-buttons">
          <NavLink to="/login" className="btn btn-primary">Login</NavLink>
          <NavLink to="/register" className="btn btn-secondary">Register</NavLink>
        </div>
      </div>

    </div>
  );
}

export default About;
