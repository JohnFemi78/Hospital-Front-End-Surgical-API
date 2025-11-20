import { Link, useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useContext, useState } from "react";
import { storeContext } from "../context/storeContext";
import { ToastContainer, toast } from "react-toastify";
import Spinner from "../layout/Spinner";

function Login() {
  const { API, password, setPassword, email, setEmail, isLoading, setIsLoading, setIsAuth } = useContext(storeContext);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  async function submitHandler() {
    try {
      setIsLoading(true);

      const response = await fetch(`${API}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      const data = await response.json();

      console.log(data);

      if (response.status === 200) {
        toast.success( "Login successful!");

        // Clear inputs
        setEmail("");
        setPassword("");

        //store the token in local storage
        localStorage.setItem("hospitalToken", data.access_token);

        // Set auth state and token
        setIsAuth(true);
        localStorage.setItem("token", data.token);

        // Navigate to dashboard
        navigate("/dashboard");
      } else {
        toast.error( "Login failed. Please check your credentials.");
      }

      setIsLoading(false);
    } catch (error) {
      console.error(error);
      toast.error("An error occurred. Please try again.");
      setIsLoading(false);
    }
  }


  function togglePassword() {
    setShowPassword((prev) => !prev);
  }

  if (isLoading) {
    return <Spinner />;
  }

  return (
    <div className="auth-login-wrapper">
  <div className="auth-login-card">
    <h2 className="auth-login-title">Login</h2>

    <form onSubmit={(e) => {
      e.preventDefault();
      submitHandler();
    }
    }>
      <div className="auth-login-form-group">
        <label htmlFor="email">Email</label>
        <input
          id="email"
          type="email"
          className="auth-login-input"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          placeholder="you@example.com"
        />
      </div>

      <div className="auth-login-form-group">
        <label htmlFor="password">Password</label>
        <input
          id="password"
          type={showPassword ? "text" : "password"}
          className="auth-login-input"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          placeholder="Enter your password"
        />
        <button
          type="button"
          onClick={togglePassword}
          className="auth-login-toggle"
          aria-label={showPassword ? "Hide password" : "Show password"}
        >
          {showPassword ? <FaEyeSlash /> : <FaEye />}
        </button>
      </div>

      <button type="submit" className="auth-login-btn">
        Login
      </button>

      <p className="auth-login-footer">
        Don’t have an account? <Link to="/register">Register</Link>
      </p>
    </form>
  </div>
  <ToastContainer position="top-right" autoClose={3000} />
</div>
  );
}

export default Login;
