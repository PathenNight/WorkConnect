import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./styles.css";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const navigateHome = () => {
    navigate('/');
  }
  const navigateSignUp = () => {
    navigate('/create');
  }

  const navigateForgot = () => {
    navigate('/forgot');
  }

  const validateForm = () => {
    const newErrors = {};
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) {
      newErrors.email = "Email is required.";
    } else if (!emailRegex.test(email)) {
      newErrors.email = "Please enter a valid email address.";
    }
  
    if (!password) {
      newErrors.password = "Password is required.";
    }
  
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0; // Return true if no errors
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) { // Call validateForm as a function
      try {
        const response = await axios.post("http://localhost:8080/login", {
          Email: email,
          Password: password,
        });
        const user = response.data.user;
        // Navigate to the user's home page
        navigate(`/home/${user.ID}`);
      } catch (err) {
        if (err.response && err.response.data.error) {
          setError(err.response.data.error);
        } else {
          setError("An unexpected error occurred. Please try again.");
        }
      }
    }
  };

  return (
    <>
      <div className="login_form">
        <form onSubmit={handleSubmit}>
          <img
            src={`${process.env.PUBLIC_URL}/favicon-formatted.png`}
            alt="WorkConnect logo"
            style={{ width: "150px", height: "120px" }}
            className="favicon-image"
            onClick={navigateHome}
          />
          <h2>Log in</h2>
          {error && <div className="error-message">{error}</div>}

          <div className="input_box">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              maxLength={50}
            />
            {errors.email && <span className="error">{errors.email}</span>}
          </div>

          <div className="input_box">
            <div className="password_title">
              <label htmlFor="password">Password</label>
              <a className="login-link" onClick={navigateForgot}>Forgot Password?</a>
            </div>

            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              maxLength={50}
            />
            {errors.password && <span className="error">{errors.password}</span>}
          </div>

          <button type="submit" className='btn-primary btn-margin-bottom'>Log In</button>

          <p className="sign_up">Don't have an account? <a className="login-link" onClick={navigateSignUp}>Sign up</a></p>
        </form>
      </div>
    </>
  );
};

export default LoginPage;
