import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./styles.css";

const LoginPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const navigateHome = () => {
    navigate('/');
  }
  const navigateSignUp = () => {
    navigate('/register/user');
  }
  const navigateCompanyRegister = () => {
    navigate('/register/company');
  }

  const navigateForgot = () => {
    navigate('/forgot');
  }

  const validateForm = () => {
    const newErrors = {};

    if (!username) {
      newErrors.username = "Username is required.";
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
        
        const response = await axios.post("http://localhost:8080/get/login", {
          Username: username,
          Password: password,
        });

        const user = response.data.user;
        console.log(user.userId);
        navigate(`/home/${user.userId}`);
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
            <label htmlFor="username">User Name</label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter your username"
              maxLength={50}
            />
            {errors.username && <span className="error">{errors.username}</span>}
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

          <p className="sign_up">Need an account? <a className="login-link" onClick={navigateSignUp}>Sign up</a></p>
          <p className="sign_up">Need to register your company? <a className="login-link" onClick={navigateCompanyRegister}>Register here</a></p>
        </form>
      </div>
    </>
  );
};

export default LoginPage;
