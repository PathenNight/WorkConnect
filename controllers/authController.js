const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const createConnection = require('../config/db');  // Assuming you're handling the connection pooling here
const User = require('../models/user');  // Assuming you have a User model

let refreshTokens = [];  // In-memory storage (use DB or cache in production)
const saltRounds = 10;

// User Registration Logic
const register = async (req, res) => {
    const { username, email, password, role, organizationName, securityQuestion, securityAnswer, recoveryKey } = req.body;

    // Basic Validation
    if (!username || !email || !password || !organizationName || !securityQuestion || !securityAnswer || !recoveryKey) {
        return res.status(400).json({ message: "Username, email, and password are required." });
    }

    const connection = await createConnection(); // Connection pooling recommended

    try {
        // Check for existing user by email (since the front end sends email)
        const [existingUser] = await connection.query(
            'SELECT * FROM Users WHERE email = ?',
            [email]
        );
        console.log("Existing User Check:", existingUser);

        if (existingUser.length > 0) {
            return res.status(409).json({ message: "Email already exists." });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        const userRole = role || 'user';

        // Insert new user
        await connection.query(
            'INSERT INTO Users (username, email, password, role, organizationName, securityQuestion, securityAnswer, recoveryKey) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [username, email, hashedPassword, userRole, organizationName, securityQuestion, securityAnswer, recoveryKey]
        );

        res.status(201).json({ message: "User registered successfully." });
    } catch (error) {
        console.error("Registration error:", error);
        res.status(500).json({ message: "Error registering user.", error: error.message }); // Include error details temporarily
    } finally {
        await connection.end(); // Close the connection
    }
};

// User Login Logic
const login = async (req, res) => {
    const { usernameOrEmail, password } = req.body;
    const connection = await createConnection();

    try {
        // Search for the user by either username or email
        const [user] = await connection.query(
            'SELECT * FROM Users WHERE username = ? OR email = ?',
            [usernameOrEmail, usernameOrEmail]
        );

        if (user.length === 0) {
            return res.status(404).json({ message: 'User not found.' });
        }

        const match = await bcrypt.compare(password, user[0].password);
        if (match) {
            const accessToken = jwt.sign({ id: user[0].id, role: user[0].role }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1h' });
            const refreshToken = jwt.sign({ id: user[0].id }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '7d' });

            // Persist refresh token if needed
            refreshTokens.push(refreshToken);

            return res.json({ message: 'Login successful', accessToken, refreshToken });
        } else {
            return res.status(401).json({ message: 'Invalid username or password.' });
        }
    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ message: 'Error logging in.' });
    } finally {
        await connection.end();
    }
};

// Refresh token logic
const refreshToken = (req, res) => {
    const { token } = req.body;
    if (!token) return res.status(401).json({ message: 'Refresh token required' });

    if (!refreshTokens.includes(token)) return res.status(403).json({ message: 'Invalid refresh token' });

    jwt.verify(token, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
        if (err) return res.status(403).json({ message: 'Invalid token' });

        const accessToken = jwt.sign({ id: user.id, role: user.role }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1h' });

        res.json({ accessToken });
    });
};

// Logout logic
const logout = (req, res) => {
    const { token } = req.body;
    
    if (!token) {
        return res.status(400).json({ message: 'Token is required' }); // Bad request if token is missing
    }
    
    // Assuming refreshTokens is an array that stores all active refresh tokens
    const tokenIndex = refreshTokens.indexOf(token);
    
    if (tokenIndex === -1) {
        return res.status(400).json({ message: 'Token not found' }); // If token isn't in the list
    }

    // Remove the refresh token
    refreshTokens.splice(tokenIndex, 1);

    return res.status(200).json({ message: 'Logout successful' }); // Success response
};

// Update user information
const updateUser = async (req, res) => {
    try {
        const { id } = req.params;
        const { Name, Email, Password, OrganizationName } = req.body;

        // Find the user by ID
        let user = await User.findById(id);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Hash password if it's updated
        let updatedPassword = Password;
        if (Password) {
            updatedPassword = await bcrypt.hash(Password, 10);
        }

        // Update user information
        user.Name = Name || user.Name;
        user.Email = Email || user.Email;
        user.Password = updatedPassword;
        user.OrganizationName = OrganizationName || user.OrganizationName;

        // Save the updated user
        await user.save();

        res.status(200).json({ message: 'User updated successfully' });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to update user' });
    }
};

// This will be your backend function to return security questions
const getSecurityQuestions = (req, res) => {
    const questions = [
        "What was the name of your first pet?",
        "What is your mother's maiden name?",
        "What was the name of your elementary school?",
        "What was the make of your first car?",
        "In what city were you born?",
        "What is your favorite book?",
        "What is your favorite food?",
        "What was your childhood nickname?",
        "What was the name of your best friend?",
        "What is the name of your favorite pet?"
    ];
    
    res.json({ questions });
};

module.exports = {
    register,
    login,
    refreshToken,
    logout,
    getSecurityQuestions,
    updateUser
};