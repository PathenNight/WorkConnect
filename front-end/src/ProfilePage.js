import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom"; // Import useLocation
import axios from "axios";
import "./styles.css";

const ProfilePage = () => {
  const { userID } = useParams();
  const navigate = useNavigate();
  const location = useLocation(); // Get the current location
  const [userData, setUserData] = useState(null);
  const [formData, setFormData] = useState({
    username: "",
    firstname: "",
    lastname: "",
    email: "",
    companyName: "",
    role: ""
  });
  const [successMessage, setSuccessMessage] = useState("");
  const [isFading, setIsFading] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/get/users/${userID}`);
        const data = response.data;
        setUserData(data);
        setFormData({
          username: data.username,
          firstname: data.firstname,
          lastname: data.lastname,
          email: data.email,
          companyName: data.companyName,
          role: data.role
        });
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    if (userID) {
      fetchUserData();
    }
  }, [userID]);

  const handleSubmit = (e) => {
    e.preventDefault();

    try {
      axios.put(`http://localhost:8080/update/users/${userID}`, formData);
      setSuccessMessage("Changes Saved!");
      setIsFading(false);

      setTimeout(() => {
        setIsFading(true);
        setTimeout(() => {
          setSuccessMessage("");
        }, 1000);
      }, 2000);
    }
    catch {
      console.error("Error saving user data.");
    }
  };

  const handleDelete = () => {
    try {
      axios.delete(`http://localhost:8080/delete/users/${userID}`);
      setSuccessMessage("User deleted successfully.");
      setTimeout(() => {
        setIsFading(true);
        setTimeout(() => {
          setSuccessMessage("");
          navigate("/");
        }, 1000);
      }, 2000);
    } catch {
      console.error("Error deleting user");
    }
  };

  const handleReturnHome = () => {
    // Only redirect if we're not already on the /home/:userID route
    if (!location.pathname.startsWith(`/home/${userID}`)) {
      navigate(`/home/${userID}`);
    }
  };

  if (!userData) {
    return <p>Loading...</p>;
  }

  return (
    <div className="login-form">
      <form className="create-form" onSubmit={handleSubmit}>
        <button
          type="button"
          className="btn-primary"
          onClick={handleReturnHome} // Handle the return home click
        >
          Return Home
        </button>
        <img
          src={`${process.env.PUBLIC_URL}/favicon-formatted.png`}
          alt="WorkConnect logo"
          style={{ width: "150px", height: "120px" }}
          className="favicon-image"
        />
        <h2>{formData.username}'s Account Details</h2>
        {successMessage && (
          <p className={`success-message ${isFading ? "fade-out" : ""}`}>
            {successMessage}
          </p>
        )}
        <div className="form-group">
          <label htmlFor="username">Username</label>
          <input
            type="text"
            id="username"
            value={formData.username}
            onChange={(e) => setFormData({ ...formData, username: e.target.value })}
            placeholder="Enter your username"
            maxLength={50}
          />
        </div>
        <div className="form-group">
          <label htmlFor="firstname">First Name</label>
          <input
            type="text"
            id="firstname"
            value={formData.firstname}
            onChange={(e) => setFormData({ ...formData, firstname: e.target.value })}
            placeholder="Enter your first name"
            maxLength={50}
          />
        </div>
        <div className="form-group">
          <label htmlFor="lastname">Last Name</label>
          <input
            type="text"
            id="lastname"
            value={formData.lastname}
            onChange={(e) => setFormData({ ...formData, lastname: e.target.value })}
            placeholder="Enter your last name"
            maxLength={50}
          />
        </div>
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            placeholder="Enter your email"
            maxLength={50}
          />
        </div>
        <button type="submit" className="btn-primary btn-margin-top">
          Save Changes
        </button>

        <button
          type="button"
          className="btn-danger btn-margin-top"
          onClick={handleDelete}
        >
          Delete Account
        </button>
      </form>
    </div>
  );
};

export default ProfilePage;
