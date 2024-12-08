// ProfilePage.js
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import "./styles.css"; // Assume the styles from your original CSS are imported here.

const ProfilePage = () => {
  const { userID } = useParams(); // Get the userID from the URL
  const [userData, setUserData] = useState(null);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    profilePicture: ""
  });

  // Fetch user data when the component mounts
  useEffect(() => {
    // Simulating a fetch call for user data
    fetch(`/api/users/${userID}`)
      .then((response) => response.json())
      .then((data) => {
        setUserData(data);
        setFormData({
          name: data.name,
          email: data.email,
          profilePicture: data.profilePicture
        });
      })
      .catch((error) => console.error("Error fetching user data:", error));
  }, [userID]);

  const handleEditToggle = () => setEditing(!editing);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSaveChanges = () => {
    // Here we would send a PUT request to save the changes to the backend.
    fetch(`/api/users/${userID}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(formData)
    })
      .then((response) => response.json())
      .then((data) => {
        setUserData(data);
        setEditing(false);
      })
      .catch((error) => console.error("Error saving user data:", error));
  };

  if (!userData) {
    return <div>Loading...</div>;
  }

  return (
    <div className="profile-page-container">
      <div className="profile-header">
        <h2 className="profile-title">{userData.name}</h2>
        <button
          className="btn-option-yes"
          onClick={handleEditToggle}
        >
          {editing ? "Cancel" : "Edit"}
        </button>
      </div>
      <div className="profile-card">
        <div className="profile-image-container">
          <img
            src={formData.profilePicture || "/default-avatar.jpg"}
            alt="Profile"
            className="profile-image"
          />
        </div>
        <div className="profile-details">
          <div className="profile-detail">
            <label>Name</label>
            {editing ? (
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
              />
            ) : (
              <p>{userData.name}</p>
            )}
          </div>
          <div className="profile-detail">
            <label>Email</label>
            {editing ? (
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
              />
            ) : (
              <p>{userData.email}</p>
            )}
          </div>
          <div className="profile-detail">
            <label>Profile Picture</label>
            {editing ? (
              <input
                type="text"
                name="profilePicture"
                value={formData.profilePicture}
                onChange={handleInputChange}
                placeholder="URL to profile picture"
              />
            ) : (
              <p>{userData.profilePicture}</p>
            )}
          </div>
          {editing && (
            <button className="btn-option-yes" onClick={handleSaveChanges}>
              Save Changes
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
