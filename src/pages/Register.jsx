import { Link, useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useContext, useState } from "react";
import { storeContext } from "../context/storeContext";
import {  toast } from "react-toastify";
import Spinner from "../layout/Spinner";

function Register() {
  const {
    API,
    password,
    setPassword,
    email,
    setEmail,
    isLoading,
    setIsLoading,
    role,
    setRole,
  } = useContext(storeContext);

  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();


async function submitHandler() {
  // console.log("Submitted Successfully", email, password);
    try {
      setIsLoading(true);
      console.log(password,role,email)
      const response = await fetch(`${API}/user/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ "email": email.trim().toLowerCase(), "password": password, "role": role }),
      });

      const data = await response.json();

      console.log(data);

      if (response.ok) {
        toast.success("Registration Successful");
        navigate("/login");
        setEmail("");
        setPassword("");
        setIsLoading(false);
      } else {
        toast.error(`Registration failed: ${data.message}`);
        setIsLoading(false);
      }
  
    } catch (error) {
      console.error(error);
      toast.error("API Error. Please try again.");
      setIsLoading(false);
    }
  }

  if (isLoading) {
    return <Spinner />;
  }

  return (
    <div className="register-wrapper">
      <div className="register-box">
        <h2 className="register-header">Create Account</h2>

        <form onSubmit={(e) => {
          e.preventDefault();
          submitHandler();
        }
        } className="register-form">
          {/* Email Field */}
          <div className="register-field">
            <label htmlFor="email" className="register-label">
              Email Address
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="you@example.com"
              className="register-input"
            />
          </div>

          {/* Role Field */}
          <div className="register-field">
            <label htmlFor="role" className="register-label">
              Role
            </label>
            <select
              id="role"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              required
              className="register-select"
            >
              <option value="">Select Role</option>
              <option value="PATIENT">PATIENT</option>
              <option value="DOCTOR">DOCTOR</option>
              <option value="ADMIN">ADMIN</option>
            </select>
          </div>

          {/* Password Field */}
          <div className="register-field password-field">
            <label htmlFor="password" className="register-label">
              Password
            </label>
            <div className="register-password-wrapper">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="Enter your password"
                className="register-input"
              />
              <button
                type="button"
                className="register-toggle"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <button type="submit" className="register-btn">
            Register
          </button>

          <p className="register-footer">
            Already have an account?{" "}
            <Link to="/login" className="register-link">
              Login
            </Link>
          </p>
        </form>
      </div>

      {/* <ToastContainer position="top-right" autoClose={3000} /> */}
    </div>
  );
}

export default Register;
