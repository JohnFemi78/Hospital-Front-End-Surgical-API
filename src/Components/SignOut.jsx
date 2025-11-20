import React from 'react';
import { useNavigate } from 'react-router-dom';
import { storeContext } from "../context/storeContext";
import { useContext, useEffect, } from "react";

function SignOut() {
  const navigate = useNavigate();
  const { setIsAuth } = useContext(storeContext);




  const handleSignOut = () => {
    // Remove user authentication tokens (if stored)
    localStorage.removeItem('hospitalToken');
    // localStorage.removeItem('user');
    setIsAuth(false);
    // Redirect to login page
    navigate('/login');
  };

  return (
    <div className="signout-container">
      <h2>Are you sure you want to sign out?</h2>
      <div className="signout-buttons">
        <button className="confirm-btn" onClick={handleSignOut}>
          Yes, Sign Out
        </button>
        <button className="cancel-btn" onClick={() => navigate('/dashboard')}>
          Cancel
        </button>
      </div>
    </div>
  );
}

export default SignOut;
