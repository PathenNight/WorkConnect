const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const createConnection = require('../config/db');  // Assuming you're handling the connection pooling here

let refreshTokens = [];  // In-memory storage (use DB or cache in production)
const saltRounds = 10;

// User Registration Logic
const register = async (req, res) => {
    const { username, email, password, role } = req.body;

    // Basic Validation
    if (!username || !email || !password) {
        return res.status(400).json({ message: "Username, email, and password are required." });
    }

    const connection = await createConnection(); // Connection pooling recommended

    try {
        // Check for existing user
        const [existingUser] = await connection.query(
            'SELECT * FROM Users WHERE username = ? OR email = ?',
            [username, email]
        );
        console.log("Existing User Check:", existingUser);

        if (existingUser.length > 0) {
            return res.status(409).json({ message: "Username or email already exists." });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        const userRole = role || 'user';

        // Insert new user
        await connection.query(
            'INSERT INTO Users (username, email, password, role) VALUES (?, ?, ?, ?)',
            [username, email, hashedPassword, userRole]
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
    refreshTokens = refreshTokens.filter(rt => rt !== token);  // Remove the refresh token
    res.json({ message: 'Logout successful' });
};

module.exports = {
    register,
    login,
    refreshToken,
    logout,
};
