import axios from "axios";
import { useLocation } from 'react-router-dom'
import { useNavigate, useParams } from "react-router-dom";
import "./ConversationStyles.css";

import React, { useState } from 'react';
//TODO: Fix search
function ConversationPage() {
    const [username1, setusername1] = useState('');
    const [username2, setusername2] = useState('');
    const [conversations, setConversations] = useState([]);
    const navigate = useNavigate();

    const navigateHome = () => {
        navigate('/');
      }
      
      const navigateConversation = () => {
        navigate('/conversation/');
        //state: { userId: userID}
      }
/** TODO: Figure this out
    const fetchUsername = async () => {
        try {
            const response = await fetch(`http://localhost:8080/get/users/${userId}`);
            const data = await response.json();
            console.log(data);
            const user = response.data.user;
            username1 = user.username;
        } catch (error) {
            console.error('Error retrieveing username:', error);
        }
    }
    */

    const submitEvent = (event) => {
        event.preventDefault(); // Prevents the form from refreshing the page

        // Check if the message is not empty
        if (username2.trim() !== '') {
        // Add the message to the chat box
        addConversation(username2);
        // Clear the input field after sending
        setusername2('');
        } else {
        alert('Please type a username before submitting!');
        }
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