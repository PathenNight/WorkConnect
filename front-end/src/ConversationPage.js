import axios from "axios";
import { useLocation } from 'react-router-dom'
import { useNavigate, useParams } from "react-router-dom";
import "./ConversationStyles.css";

import React, { useState } from 'react';
//TODO: Fix search
function ConversationPage() {
    const [conversations, setConversations] = useState([]);
    const navigate = useNavigate();
    const location = useLocation(); 
    const { userId } = location.state || {};
    const [username2, setUsername2] = useState("");

    const navigateHome = () => {
        navigate('/');
      }
      
      const navigateConversation = () => {
        navigate('/conversation/', { state: { userId: userId } });
      };
      
    const fetchUsername = async () => {
        try {
            const response = await fetch(`http://localhost:8080/get/users/${userId}`);
            const data = await response.json();
            console.log(data);
            const user = response.data.user;
            username2 = user.username;
        } catch (error) {
            console.error('Error retrieving username:', error);
        }
    }

    const handleInputChange = (event) => {
        setUsername2(event.target.value);
      };
    
      const handleSubmit = (event) => {
        event.preventDefault();
        if (username2.trim() === "") {
          alert("Please type a username before searching.");
          return;
        }
        console.log("Searching for username:", username2);
        //TODO: Search for if username2 exists. If it does, display it.
      };

    const addConversation = (username2) => {
        setConversations((prevConversations) => [...prevConversations, username2]);
    };

    const handleConversationClick = (username2) => {
        // Passes the conversation partner's name to the message page (and takes the user there)
        window.location.href = `message.html?username2=${encodeURIComponent(username2)}`;
    };

    return (
        <div className="conversationpage-container">
        <nav className="navbar">
                <div className="navbar-links">
                    <a href="#profile">Profile</a>
                    <p className="conversationLink"><a className="conversationLink" onClick={navigateConversation}>Conversation</a></p>
                    <a href="#notifications">Notifications</a>
                </div>
            </nav>
        
        <form id="userSearch">
            <textarea id="userSearchBox" placeholder="Type your colleague's username here..." required></textarea>
            <button type="submit">Search</button>
        </form>
        
        <div class="container">
            <div id="conversationBox" class="conversation-box">
            </div>
        </div>
        </div>
    );
};

export default ConversationPage;