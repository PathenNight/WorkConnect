import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import "./styles.css";
import SecurityQuestionDropdown from './SecurityQuestionDropdown';

function CreateCompany() {
    const [step, setStep] = useState(1);
    const [accountData, setAccountData] = useState({
        Username: '',
        Firstname: '',
        Lastname: '',
        Email: '',
        Password: '',
        SecurityQuestion1: '',
        SecurityAnswer1: '',
        SecurityQuestion2: '',
        SecurityAnswer2: '',
        SecurityQuestion3: '',
        SecurityAnswer3: ''
    });
    const [companyData, setCompanyData] = useState({
        CompanyName: '',
        CompanyIndustry: '',
        CompanyAddress: ''
    })
    const [errors, setErrors] = useState({});
    const [successMessage, setSuccessMessage] = useState("");

    const navigate = useNavigate();

    const validateForm = (data, step) => {
        const newErrors = {};
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    
        if (step === 1) {
            // Validate email
            if (!data.Email) {
                newErrors.Email = "Email is required.";
            } else if (!emailRegex.test(data.Email)) {
                newErrors.Email = "Please enter a valid email address.";
            }
            // Validate other fields
            if (!data.Firstname) newErrors.Firstname = 'First name is required.';
            if (!data.Lastname) newErrors.Lastname = 'Last name is required.';
            if (!data.Username) newErrors.Username = 'Username is required.';
            if (!data.Password) newErrors.Password = 'Password is required.';
            if (!data.SecurityQuestion1) {
                newErrors.SecurityQuestion1 = 'Select a security question.';
            }
            if (!data.SecurityAnswer1) {
                newErrors.SecurityAnswer1 = 'Answer the security question.';
            }
            if (!data.SecurityQuestion2) {
                newErrors.SecurityQuestion2 = 'Select a security question.';
            }
            if (!data.SecurityAnswer2) {
                newErrors.SecurityAnswer2 = 'Answer the security question.';
            }
            if (!data.SecurityQuestion3) {
                newErrors.SecurityQuestion3 = 'Select a security question.';
            }
            if (!data.SecurityAnswer3) {
                newErrors.SecurityAnswer3 = 'Answer the security question.';
            }
        } else if (step === 2) {
            if (!data.CompanyName) newErrors.CompanyName = 'Company name is required.';
            if (!data.CompanyIndustry) newErrors.CompanyIndustry = 'Company industry is required.';
            if (!data.CompanyAddress) newErrors.CompanyAddress = 'Company address is required.';
        }
    
        setErrors(newErrors); // Update state with errors
        return Object.keys(newErrors).length === 0; // Return if no errors
    };

    const handleNext = async (e) => {
        e.preventDefault();

        // Run validation and stop execution if it fails
        if (!validateForm(accountData, 1)) {
            console.log("Form not valid");
            return; // Stop here if the form has errors
        }

        // Check email availability via API
        try {
            const response = await axios.post('http://localhost:8080/get/validate-email', { Email: accountData.Email });
            if (!response.data.isValid) {
                setErrors((prevErrors) => ({
                    ...prevErrors,
                    Email: response.data.message, // Update email-specific error
                }));
                return;
            }
        } catch (error) {
            console.error("Error validating email:", error);
            setErrors((prevErrors) => ({
                ...prevErrors,
                server: "Failed to validate email. Please try again later.",
            }));
            return;
        }

        // If validation and API checks pass, proceed to the next step
        setStep(2);
        setErrors({});
    };

    const handleCompanySubmit = async (e) => {
        e.preventDefault();
        if (validateForm(companyData, 2)) {
            try {
                await axios.post('http://localhost:8080/create/company', {
                    ...accountData,
                    ...companyData
                });
                setSuccessMessage('Account and Company created successfully!');
                setTimeout(() => navigate('/'), 2000); // Redirect to home after 2 seconds
            } catch (err) {
                console.error('Error creating company:', err.response || err);
                setErrors({ server: 'Failed to create company. Please try again later.' });
            }
        }
    };

    const handleSecurityQuestion1Change = (question) => {
        setAccountData((prev) => ({ ...prev, SecurityQuestion1: question }));
    };

    const handleSecurityQuestion2Change = (question) => {
        setAccountData((prev) => ({ ...prev, SecurityQuestion2: question }));
    };

    const handleSecurityQuestion3Change = (question) => {
        setAccountData((prev) => ({ ...prev, SecurityQuestion3: question }));
    };


    const handleInputChange = (e, stateUpdater) => {
        const { id, value } = e.target;
        stateUpdater(prev => ({ ...prev, [id]: value }));
    };

    return (
        <div className="login-form">
            {successMessage ? (
                <div className="success-container">
                    <h1>{successMessage}</h1>
                </div>
            ) : (
                <form className="create-form">
                    <img
                        src={`${process.env.PUBLIC_URL}/favicon-formatted.png`}
                        alt="WorkConnect logo"
                        style={{ width: '150px', height: '120px' }}
                        className="favicon-image"
                        onClick={() => navigate('/')}
                    />
                    <h2>{step === 1 ? 'Create Account' : 'Enter Company Details'}</h2>
                    {errors.server && <div className="error-message">{errors.server}</div>}

                    {step === 1 && (
                        <>
                            <div className="form-group">
                                <label htmlFor="Firstname">First Name</label>
                                <input
                                    type="text"
                                    id="Firstname"
                                    value={accountData.Firstname}
                                    onChange={(e) => handleInputChange(e, setAccountData)}
                                />
                                {errors.Firstname && <span className="error">{errors.Firstname}</span>}
                            </div>
                            <div className="form-group">
                                <label htmlFor="LastName">Last Name</label>
                                <input
                                    type="text"
                                    id="Lastname"
                                    value={accountData.Lastname}
                                    onChange={(e) => handleInputChange(e, setAccountData)}
                                />
                                {errors.Lastname && <span className="error">{errors.Lastname}</span>}
                            </div>
                            <div className="form-group">
                                <label htmlFor="Email">Email</label>
                                <input
                                    type="email"
                                    id="Email"
                                    value={accountData.Email}
                                    onChange={(e) => handleInputChange(e, setAccountData)}
                                />
                                {errors.Email && <span className="error">{errors.Email}</span>}
                            </div>
                            <div className="form-group">
                                <label htmlFor="Username">Username</label>
                                <input
                                    type="text"
                                    id="Username"
                                    value={accountData.Username}
                                    onChange={(e) => handleInputChange(e, setAccountData)}
                                />
                                {errors.Username && <span className="error">{errors.Username}</span>}
                            </div>
                            <div className="form-group">
                                <label htmlFor="Password">Password</label>
                                <input
                                    type="password"
                                    id="Password"
                                    value={accountData.Password}
                                    onChange={(e) => handleInputChange(e, setAccountData)}
                                />
                                {errors.Password && <span className="error">{errors.Password}</span>}
                            </div>
                            <SecurityQuestionDropdown
                                onQuestionSelect={(question) => {
                                    handleSecurityQuestion1Change(question);
                                    setErrors((prevErrors) => ({
                                        ...prevErrors,
                                        SecurityQuestion1: question ? undefined : 'Select a security question.',
                                    }));
                                }}
                                error={errors.SecurityQuestion1}
                            />
                            {errors.SecurityQuestion1 && <span className="error">Select a security question</span>}
                            <div className="form-group">
                                <label htmlFor="SecurityAnswer1">Answer 1</label>
                                <input
                                    type="text"
                                    id="SecurityAnswer1"
                                    value={accountData.SecurityAnswer1}
                                    onChange={(e) => handleInputChange(e, setAccountData)}
                                />
                                {errors.SecurityAnswer1 && <span className="error">{errors.SecurityAnswer1}</span>}
                            </div>
                            <SecurityQuestionDropdown onQuestionSelect={handleSecurityQuestion2Change} />
                            {errors.SecurityQuestion2 && <span className="error">{errors.SecurityQuestion2}</span>}
                            <div className="form-group">
                                <label htmlFor="SecurityAnswer2">Answer 2</label>
                                <input
                                    type="text"
                                    id="SecurityAnswer2"
                                    value={accountData.SecurityAnswer2}
                                    onChange={(e) => handleInputChange(e, setAccountData)}
                                />
                                {errors.SecurityAnswer2 && <span className="error">{errors.SecurityAnswer2}</span>}
                            </div>
                            <SecurityQuestionDropdown onQuestionSelect={handleSecurityQuestion3Change} />
                            {errors.SecurityQuestion3 && <span className="error">{errors.SecurityQuestion3}</span>}
                            <div className="form-group">
                                <label htmlFor="SecurityAnswer3">Answer 3</label>
                                <input
                                    type="text"
                                    id="SecurityAnswer3"
                                    value={accountData.SecurityAnswer3}
                                    onChange={(e) => handleInputChange(e, setAccountData)}
                                />
                                {errors.SecurityAnswer3 && <span className="error">{errors.SecurityAnswer3}</span>}
                            </div>
                            <button type="button" className="btn-primary" onClick={handleNext}>
                                Next
                            </button>
                        </>
                    )}

                    {step === 2 && (
                        <>
                            <div className="form-group">
                                <label htmlFor="CompanyName">Company Name</label>
                                <input
                                    type="text"
                                    id="CompanyName"
                                    value={companyData.CompanyName}
                                    onChange={(e) => handleInputChange(e, setCompanyData)}
                                />
                                {errors.CompanyName && <span className="error">{errors.CompanyName}</span>}
                            </div>
                            <div className="form-group">
                                <label htmlFor="CompanyIndustry">Industry</label>
                                <input
                                    type="text"
                                    id="CompanyIndustry"
                                    value={companyData.CompanyIndustry}
                                    onChange={(e) => handleInputChange(e, setCompanyData)}
                                />
                                {errors.CompanyIndustry && <span className="error">{errors.CompanyIndustry}</span>}
                            </div>
                            <div className="form-group">
                                <label htmlFor="CompanyAddress">Company Address</label>
                                <input
                                    type="text"
                                    id="CompanyAddress"
                                    value={companyData.CompanyAddress}
                                    onChange={(e) => handleInputChange(e, setCompanyData)}
                                />
                                {errors.CompanyAddress && <span className="error">{errors.CompanyAddress}</span>}
                            </div>
                            <button type="button" className="btn-primary" onClick={handleCompanySubmit}>
                                Submit
                            </button>
                        </>
                    )}
                </form>
            )}
        </div>
    );
};

export default CreateCompany;