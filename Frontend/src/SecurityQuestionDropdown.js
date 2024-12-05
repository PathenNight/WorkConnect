import React, { useState, useEffect } from 'react';
import axios from 'axios';  // Ensure you have axios installed

const SecurityQuestionDropdown = ({ onQuestionSelect }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState('');
  const [questions, setQuestions] = useState([]);

  // Fetch security questions from the backend
  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await axios.get('/api/auth/security-questions');
        setQuestions(response.data.questions);  // Assuming the backend returns a `questions` array
      } catch (error) {
        console.error("Error fetching security questions", error);
      }
    };

    fetchQuestions();
  }, []);  // Empty dependency array means this runs once when the component mounts

  const toggleDropdown = () => {
    setIsOpen(prev => !prev);
  };

  const handleSelectOption = (question) => {
    setSelectedOption(question);
    setIsOpen(false); // Close dropdown after selection
    if (onQuestionSelect) {
      onQuestionSelect(question); // Notify parent about selected question
    }
  };

  return (
    <div className="form-group">
      <label htmlFor="securityQuestion">Select a security question below</label>
      <div className="dropdown-container">
        <div
          className="dropdown"
          onClick={toggleDropdown}
          tabIndex={0} // makes it focusable
        >
          {selectedOption || "Select a question..."}
        </div>
        <div
          className={`dropdown-options ${isOpen ? 'open' : 'closed'}`}
        >
          {questions.map((question, index) => (
            <div
              key={index}
              className={`dropdown-item ${selectedOption === question ? 'selected-option' : ''}`}
              onClick={() => handleSelectOption(question)}
            >
              {question}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SecurityQuestionDropdown;
