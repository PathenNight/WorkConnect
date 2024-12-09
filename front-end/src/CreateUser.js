import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import "./styles.css";
import SecurityQuestionDropdown from './SecurityQuestionDropdown';

function CreateUser() {
    const [Username, setUsername] = useState("");
    const [Firstname, setFirstname] = useState("");
    const [Lastname, setLastname] = useState("");
    const [Email, setEmail] = useState("");
    const [Password, setPassword] = useState("");
    const [CompanyName, setCompanyName] = useState("");
    const [SecurityQuestion1, setSecurityQuestion1] = useState("");
    const [SecurityAnswer1, setSecurityAnswer1] = useState("");
    const [SecurityQuestion2, setSecurityQuestion2] = useState("");
    const [SecurityAnswer2, setSecurityAnswer2] = useState("");
    const [SecurityQuestion3, setSecurityQuestion3] = useState("");
    const [SecurityAnswer3, setSecurityAnswer3] = useState("");
    const [errors, setErrors] = useState({});
    const [successMessage, setSuccessMessage] = useState("");
    const [isAccountCreated, setIsAccountCreated] = useState(false);

    const navigate = useNavigate();

    const navigateHome = () => {
        navigate('/');
    };

    const validateForm = () => {
        const newErrors = {};
        if (!Firstname) newErrors.Firstname = "First name is required.";
        if (!Username) newErrors.Username = "Username is required.";
        if (!Lastname) newErrors.Lastname = "Last name is required.";
        if (!Email) newErrors.Email = "Email is required.";

        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (Email && !emailPattern.test(Email)) {
        newErrors.Email = "Please enter a valid email.";
    }

        if (!Password) newErrors.Password = "Password is required.";
        if (!CompanyName) newErrors.CompanyName = "Company name is required.";
        if (!SecurityQuestion1) newErrors.SecurityQuestion1 = "Please select a security question.";
        if (!SecurityAnswer1) newErrors.SecurityAnswer1 = "Answer to the security question is required.";
        if (!SecurityQuestion2) newErrors.SecurityQuestion2 = "Please select a security question.";
        if (!SecurityAnswer2) newErrors.SecurityAnswer2 = "Answer to the security question is required.";
        if (!SecurityQuestion3) newErrors.SecurityQuestion3 = "Please select a security question.";
        if (!SecurityAnswer3) newErrors.SecurityAnswer3 = "Answer to the security question is required.";
        setErrors(newErrors);

        return Object.keys(newErrors).length === 0; // Return true if no errors
    };

    const handleSecurityQuestion1Change = (question) => {
        setSecurityQuestion1(question);
    };
    const handleSecurityQuestion2Change = (question) => {
        setSecurityQuestion2(question);
    };
    const handleSecurityQuestion3Change = (question) => {
        setSecurityQuestion3(question);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (validateForm()) {
            try {
                const response = await axios.post('http://localhost:8080/get/validate-email', { Email: Email });
                if (response.data.isValid) {
                    setErrors({});
                } else {
                    setErrors({ Email: "This email is already in use." });
                    return;
                }
            } catch (error) {
                console.error("Email validation failed:", error);
                setErrors({ Email: "Unable to validate email at the moment. Please try again later." });
                return;
            }

            try {
                await axios.post("http://localhost:8080/create/user", {
                    Username,
                    Password,
                    Firstname,
                    Lastname,
                    Email,
                    CompanyName,
                    SecurityQuestion1,
                    SecurityAnswer1,
                    SecurityQuestion2,
                    SecurityAnswer2,
                    SecurityQuestion3,
                    SecurityAnswer3
                });

                // Handle successful account creation
                setSuccessMessage("Account created successfully!");
                setIsAccountCreated(true);

                // Reset form values after successful account creation
                setUsername("");
                setFirstname("");
                setLastname("");
                setEmail("");
                setPassword("");
                setCompanyName("");
                setSecurityQuestion1("");
                setSecurityAnswer1("");
                setSecurityQuestion2("");
                setSecurityAnswer2("");
                setSecurityQuestion3("");
                setSecurityAnswer3("");
            } catch (err) {
                console.error("Error creating user:", err.response || err);
                setErrors({ server: "Failed to create user. Please try again later." });
            }
        }
    };

    return (
        <div className="login-form">

            {!isAccountCreated ? (
                <form className="create-form" onSubmit={handleSubmit}>
                    <img
                        src={`${process.env.PUBLIC_URL}/favicon-formatted.png`}
                        alt="WorkConnect logo"
                        style={{ width: "150px", height: "120px" }}
                        className="favicon-image"
                        onClick={navigateHome}
                    />
                    <h2>Create Your Account</h2>
                    
                    {errors.server && <div className="error-message">{errors.server}</div>}
                    {successMessage && <div className="success-message">{successMessage}</div>}

                    {/* Form Fields */}
                    <div className="form-group">
                        <label htmlFor="firstname">First Name</label>
                        <input
                            type="text"
                            id="firstname"
                            value={Firstname}
                            onChange={(e) => setFirstname(e.target.value)}
                            placeholder="Enter your first name"
                            maxLength={50}
                        />
                        {errors.Firstname && <span className="error">{errors.Firstname}</span>}
                    </div>

                    <div className="form-group">
                        <label htmlFor="lastname">Last Name</label>
                        <input
                            type="text"
                            id="lastname"
                            value={Lastname}
                            onChange={(e) => setLastname(e.target.value)}
                            placeholder="Enter your last name"
                            maxLength={50}
                        />
                        {errors.Lastname && <span className="error">{errors.Lastname}</span>}
                    </div>

                    <div className="form-group">
                        <label htmlFor="username">Username</label>
                        <input
                            type="text"
                            id="username"
                            value={Username}
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder="Enter your username"
                            maxLength={50}
                        />
                        {errors.Username && <span className="error">{errors.Username}</span>}
                    </div>

                    <div className="form-group">
                        <label htmlFor="email">Email</label>
                        <input
                            type="email"
                            id="email"
                            value={Email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Enter your email"
                            maxLength={50}
                        />
                        {errors.Email && <span className="error">{errors.Email}</span>}
                    </div>

                    <div className="form-group">
                        <label htmlFor="password">Password</label>
                        <input
                            type="password"
                            id="password"
                            value={Password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Enter your password"
                            maxLength={50}
                        />
                        {errors.Password && <span className="error">{errors.Password}</span>}
                    </div>

                    <div className="form-group">
                        <label htmlFor="companyName">Company Name</label>
                        <input
                            type="text"
                            id="companyName"
                            value={CompanyName}
                            onChange={(e) => setCompanyName(e.target.value)}
                            placeholder="Enter your company name"
                            maxLength={50}
                        />
                        {errors.CompanyName && <span className="error">{errors.CompanyName}</span>}
                    </div>

                    {/* Security Question Fields */}
                    <SecurityQuestionDropdown onQuestionSelect={handleSecurityQuestion1Change} />
                    <div className="form-group">
                        <label htmlFor="securityAnswer1">Answer 1</label>
                        <input
                            type="text"
                            id="securityAnswer1"
                            value={SecurityAnswer1}
                            onChange={(e) => setSecurityAnswer1(e.target.value)}
                            placeholder="Enter your answer"
                            maxLength={50}
                        />
                        {errors.SecurityAnswer1 && <span className="error">{errors.SecurityAnswer1}</span>}
                    </div>

                    <SecurityQuestionDropdown onQuestionSelect={handleSecurityQuestion2Change} />
                    <div className="form-group">
                        <label htmlFor="securityAnswer2">Answer 2</label>
                        <input
                            type="text"
                            id="securityAnswer2"
                            value={SecurityAnswer2}
                            onChange={(e) => setSecurityAnswer2(e.target.value)}
                            placeholder="Enter your answer"
                            maxLength={50}
                        />
                        {errors.SecurityAnswer2 && <span className="error">{errors.SecurityAnswer2}</span>}
                    </div>

                    <SecurityQuestionDropdown onQuestionSelect={handleSecurityQuestion3Change} />
                    <div className="form-group">
                        <label htmlFor="securityAnswer3">Answer 3</label>
                        <input
                            type="text"
                            id="securityAnswer3"
                            value={SecurityAnswer3}
                            onChange={(e) => setSecurityAnswer3(e.target.value)}
                            placeholder="Enter your answer"
                            maxLength={50}
                        />
                        {errors.SecurityAnswer3 && <span className="error">{errors.SecurityAnswer3}</span>}
                    </div>

                    <button type="submit" className="btn-primary">Create Account</button>
                </form>
            ) : (
                <div className="success-container">
                    <div className="success-message">
                        <img
                            src={`${process.env.PUBLIC_URL}/favicon.png`}
                            alt="WorkConnect logo"
                            style={{ width: "200px", height: "200px" }}
                            className="favicon-image"
                        />
                        <h1>Account Created Successfully!</h1>
                        <button className="btn-primary" onClick={navigateHome}>Go to Home Page</button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default CreateUser;
