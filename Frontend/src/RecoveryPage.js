import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import "./styles.css";

function RecoveryPage() {
    const [hasRecoveryKey, setHasRecoveryKey] = useState(null); // Tracks if the user has a recovery key
    const [recoveryKey, setRecoveryKey] = useState("");
    const [email, setEmail] = useState("");
    const [securityQuestion, setSecurityQuestion] = useState("");
    const [securityAnswer, setSecurityAnswer] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const navigate = useNavigate();

    const navigateHome = () => {
        navigate('/');
    }
    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
    
        if (hasRecoveryKey === null) {
            setError("Please select if you have your recovery key.");
            return;
        }
    
        try {
            if (hasRecoveryKey) {
                // If user has recovery key, try to find the account by key
                const response = await axios.post("http://localhost:5000/recover-by-key", { recoveryKey });
                if (response.data.found) {
                    setSuccessMessage(`Account found! Your email is: ${response.data.email}.`);
                } else {
                    setError("No account found with this recovery key.");
                }
            } else {
                // If no recovery key, ask for email
                const response = await axios.post("http://localhost:5000/recover-by-email", { email });
                if (response.data.found) {
                    setSecurityQuestion(response.data.securityQuestion);
                } else {
                    setError("No account found with this email.");
                }
            }
        } catch (err) {
            setError("Error recovering account. Please try again.");
        }
    };

    const handleSecurityAnswerSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post("http://localhost:5000/verify-answer", { email, answer: securityAnswer });

            if (response.data.correct) {
                setSuccessMessage(`Account verified! Your password is: ${response.data.password}`);
            } else {
                setError("Incorrect answer. Please reach out to support@workconnect.com for assistance.");
            }
        } catch (err) {
            setError("Error verifying answer. Please try again.");
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


            <form onSubmit={handleSubmit} className="create-form">

                {hasRecoveryKey === null && (
                    <div className="form-group">
                        <div>
                            <label>Do you have a recovery key?</label>
                            <button
                                type="button"
                                onClick={() => setHasRecoveryKey(true)}
                                className={'btn-option-yes'}
                            >
                                Yes
                            </button>
                            <button
                                type="button"
                                onClick={() => setHasRecoveryKey(false)}
                                className={'btn-option-no'}
                            >
                                No
                            </button>
                        </div>
                    </div>
                )}

                {hasRecoveryKey !== null && hasRecoveryKey && (
                    <div className="form-group">
                        <label htmlFor="recoveryKey">Enter Your Recovery Key</label>
                        <input
                            type="text"
                            id="recoveryKey"
                            value={recoveryKey}
                            onChange={(e) => setRecoveryKey(e.target.value)}
                            placeholder="Enter your recovery key"
                        />
                    </div>
                )}

                {hasRecoveryKey !== null && !hasRecoveryKey && (
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
                )}
                {hasRecoveryKey !== null && (
                    <button className='btn-primary' type="submit">
                    Submit
                </button>
                )}
                
            </form>

            {/* Security Question Section */}
            {securityQuestion && (
                <form onSubmit={handleSecurityAnswerSubmit} className="create-form">
                    <div className="form-group">
                        <label>{securityQuestion}</label>
                        <input
                            type="text"
                            value={securityAnswer}
                            onChange={(e) => setSecurityAnswer(e.target.value)}
                            placeholder="Enter your answer"
                        />
                    </div>

                    <button type="submit" className="btn-primary">
                        Verify Answer
                    </button>
                </form>
            )}
        </div>
    );
}

export default RecoveryPage;