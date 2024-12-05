import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./styles.css";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:5000/login", {
        usernameOrEmail: email,  // Send email or username as `usernameOrEmail`
        password: password,      // Send the password
      });
      const { accessToken, refreshToken, user } = response.data;
  
      // Store access and refresh tokens (e.g., in localStorage or sessionStorage)
      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("refreshToken", refreshToken);
  
      // Navigate to the user's home page
      navigate(`/home/${user.ID}`);
    } catch (err) {
      if (err.response && err.response.data.message) {
        setError(err.response.data.message); // Display error from the backend
      } else {
        setError("An unexpected error occurred. Please try again.");
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

          <div class="input_box">
            <label for="email">Email</label>
            <input type="email" id="email" placeholder="Enter email address" required />
          </div>

          <div class="input_box">
            <div class="password_title">
              <label for="password">Password</label>
              <a className="login-link" onClick={navigateForgot}>Forgot Password?</a>
            </div>

            <input type="password" id="password" placeholder="Enter your password" required />
          </div>

          <button type="submit" className='btn-primary btn-margin-bottom'>Log In</button>

          <p class="sign_up">Don't have an account? <a className="login-link" onClick={navigateSignUp}>Sign up</a></p>
        </form>
      </div>
    </>
  );
};

export default LoginPage;