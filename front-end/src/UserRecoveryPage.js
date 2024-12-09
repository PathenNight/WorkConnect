import React, { useState } from 'react';  
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import "./styles.css";

function RecoveryPage() {
    const [email, setEmail] = useState("");
    const [securityQuestions, setSecurityQuestions] = useState([]); 
    const [answers, setAnswers] = useState({ 1: "", 2: "", 3: "" }); 
    const [username, setUsername] = useState(""); 
    const [error, setError] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const [isVerified, setIsVerified] = useState(false); 
    const [usernameUpdated, setUsernameUpdated] = useState(false); 
    const navigate = useNavigate();

    const navigateHome = () => {
        navigate('/');
    };

    const validateEmail = () => {
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!email) {
            setError("Email cannot be empty.");
            return false;
        }
        if (!emailPattern.test(email)) {
            setError("Please enter a valid email.");
            return false;
        }
        setError("");
        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if(validateEmail()){
            try {
                const response = await axios.get(`http://localhost:8080/get/user/${email}`);
    
                if (response.data.found) {
                    setSecurityQuestions(response.data.securityQuestions);
                    setError(""); // Clear any previous errors
                } else {
                    setError("No account found with this email.");
                }
            } catch (err) {
                setError("Error retrieving account. Please try again.");
            }
        }
    };

    const handleAnswerSubmit = async (e) => {
        e.preventDefault();
        if (!answers[1] || !answers[2] || !answers[3]) {
            setError("All answers must be filled in.");
            return;
        }

        try {
            const response = await axios.post("http://localhost:8080/verify-answers", { email, answers });

            if (response.data.correct) {
                setSuccessMessage("Answers verified! Please enter a new username.");
                setIsVerified(true); // Mark as verified
                setError(""); // Clear any previous errors
            } else {
                setError("Incorrect answers. Please try again or contact support.");
            }
        } catch (err) {
            setError("Error verifying answers. Please try again.");
        }
    };

    const handleUserSubmit = async (e) => {
        e.preventDefault();

        if (!username) {
            setError("Please enter a new username.");
            return;
        }

        try {
            const response = await axios.put("http://localhost:8080/update/username", { email, username });

            if (response.data.changed) {
                setUsernameUpdated(true);
                setSuccessMessage("Username updated successfully!");
                setError("");

                
                setTimeout(() => {
                    navigateHome();
                }, 2000);
            } else {
                setError("Error updating username. Please try again.");
            }
        } catch (err) {
            setError("Error updating username. Please try again.");
        }
    };

    return (
        <div className="login-form">
            <img
                src={`${process.env.PUBLIC_URL}/favicon-formatted.png`}
                alt="WorkConnect logo"
                style={{ width: "150px", height: "120px" }}
                className="favicon-image"
                onClick={navigateHome}
            />
            <h2>Account Recovery</h2>

            {successMessage && <div className="success-message">{successMessage}</div>}
            {error && <div className="error-message">{error}</div>}

            {/* Step 1: Enter Email */}
            {!securityQuestions.length ? (
                <form onSubmit={handleSubmit} className="create-form">
                    <div className="form-group">
                        <label htmlFor="email">Enter Your Email</label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Enter your email"
                        />
                    </div>
                    <button className='btn-primary' type="submit">
                        Submit
                    </button>
                </form>
            ) : (
                // Step 2: Answer security questions
                !isVerified && (
                    <form onSubmit={handleAnswerSubmit} className="create-form">
                        {securityQuestions.map((question, index) => (
                            <div key={index} className="form-group">
                                <label>{question}</label>
                                <input
                                    type="text"
                                    value={answers[index + 1] || ""}
                                    onChange={(e) => setAnswers({ ...answers, [index + 1]: e.target.value })}
                                    placeholder="Enter your answer"
                                />
                            </div>
                        ))}

                        <button type="submit" className="btn-primary">
                            Verify Answers
                        </button>
                    </form>
                )
            )}

            {isVerified && successMessage.includes("Please enter a new username") && (
                <form onSubmit={handleUserSubmit} className="create-form">
                    <div className="form-group">
                        <label htmlFor="username">New Username</label>
                        <input
                            type="username"
                            id="username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder="Enter your new username"
                        />
                    </div>

                    <button type="submit" className="btn-primary">
                        Update Username
                    </button>
                </form>
            )}
            
        </div>
    );
}

export default RecoveryPage;
