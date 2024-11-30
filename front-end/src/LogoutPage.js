import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './styles.css';

const LogoutPage = () => {
    const navigate = useNavigate();
    const [secondsRemaining, setSecondsRemaining] = useState(5);

    useEffect(() => {
        const interval = setInterval(() => {
            setSecondsRemaining((prev) => prev - 1);
        }, 1000);

        const timer = setTimeout(() => {
            navigate('/');
        }, 5000);

        return () => {
            clearInterval(interval);
            clearTimeout(timer);
        };
    }, [navigate]);

    return (
        <div className="logout-page-container fade-in-out">
            <div className="logout-message">
                <img
                    src={`${process.env.PUBLIC_URL}/favicon.png`}
                    alt="WorkConnect logo"
                    style={{ width: "200px", height: "200px" }}
                    className="favicon-image"
                />
                <h1>Goodbye!</h1>
                <p>You have been logged out. Thank you for using <span className="countdown">WorkConnect</span>!</p>
                <p>Redirecting you to the login page in <span className="countdown">{secondsRemaining}</span> seconds...</p>
            </div>
        </div>
    );
};

export default LogoutPage;