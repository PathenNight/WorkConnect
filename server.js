const express = require('express');
const mysql = require('mysql2');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const dotenv = require('dotenv');
const crypto = require('crypto');
const fs = require('fs');
const https = require('https');

dotenv.config();

const app = express();
const port = 3001;
let refreshTokens = [];
const saltRounds = 10;

// Middleware
app.use(express.json());

const connection = mysql.createConnection({
    host: '127.0.0.1',
    user: 'workConnect',
    password: '9Zt#Q1p@',
    database: 'WorkConnectDB',
});

// Connect to the database
connection.connect(err => {
    if (err) throw err;
    console.log('Connected to the database.');
});

// HTTPS server options (Use real certs in production)
const httpsOptions = {
    key: fs.readFileSync('path/to/your/ssl/key.pem'), // Path to your SSL key
    cert: fs.readFileSync('path/to/your/ssl/cert.pem'), // Path to your SSL cert
};

// HTTPS Server Setup
const httpsServer = https.createServer(httpsOptions, app);

// Listen on all network interfaces to allow external access
httpsServer.listen(port, '0.0.0.0', () => {
    console.log(`HTTPS server is running on https://0.0.0.0:${port}`);
});

// Create Users table if it doesn't exist
const createUsersTable = () => {
    const query = `
        CREATE TABLE IF NOT EXISTS Users (
            id INT AUTO_INCREMENT PRIMARY KEY,
            username VARCHAR(255) NOT NULL UNIQUE,
            email VARCHAR(255) NOT NULL UNIQUE,
            password VARCHAR(255) NOT NULL,
            role VARCHAR(50) NOT NULL DEFAULT 'admin',
            resetToken VARCHAR(255),
            resetTokenExpiry DATETIME
        )
    `;
    connection.query(query, (err) => {
        if (err) {
            console.error('Error creating Users table:', err);
        } else {
            console.log('Users table created or already exists.');
        }
    });
};

// Call function to create table
createUsersTable();

// User Registration Route
app.post('/register', async (req, res) => {
    const { username, email, password } = req.body;

    try {
        const [existingUser] = await connection.promise().query('SELECT * FROM Users WHERE username = ? OR email = ?', [username, email]);
        if (existingUser.length > 0) {
            return res.status(409).json({ message: "Username or email already exists." });
        }

        const hashedPassword = await bcrypt.hash(password, saltRounds);
        await connection.promise().query('INSERT INTO Users (username, email, password, role) VALUES (?, ?, ?, ?)', [username, email, hashedPassword, 'admin']);
        res.status(201).json({ message: "User registered successfully." });
    } catch (error) {
        console.error("Registration error:", error);
        res.status(500).json({ message: "Error registering user." });
    }
});

// Login route
app.post('/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        const [user] = await connection.query('SELECT * FROM Users WHERE username = ?', [username]);
        if (user.length === 0) {
            return res.status(404).json({ message: 'User not found.' });
        }

        const match = await bcrypt.compare(password, user[0].password);
        if (match) {
            const accessToken = jwt.sign({ id: user[0].id, role: user[0].role }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1h' });
            const refreshToken = jwt.sign({ id: user[0].id }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '7d' });

            refreshTokens.push(refreshToken);
            return res.json({ message: 'Login successful', accessToken, refreshToken });
        } else {
            return res.status(401).json({ message: 'Invalid username or password.' });
        }
    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ message: 'Error logging in.' });
    }
});

// Refresh token route
app.post('/token', (req, res) => {
    const { token } = req.body;
    if (!token) return res.status(401).json({ message: 'Refresh token required' });

    if (!refreshTokens.includes(token)) return res.status(403).json({ message: 'Invalid refresh token' });

    jwt.verify(token, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
        if (err) return res.status(403).json({ message: 'Invalid token' });

        const accessToken = jwt.sign({ id: user.id, role: user.role }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1h' });

        res.json({ accessToken });
    });
});

// Middleware to verify JWT token
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'Access denied, no token provided.' });
    }

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({ message: 'Invalid token.' });
        }

        req.user = user;
        next();
    });
};

// Middleware to check user role from JWT
function checkRole(roles) {
    return (req, res, next) => {
        if (roles.includes(req.user.role)) {
            next();
        } else {
            res.status(403).json({ message: 'Access denied.' });
        }
    };
}

// Example: Protect route with JWT and role-based access
app.get('/manage-team', authenticateToken, checkRole(['team lead', 'admin']), (req, res) => {
    res.json({ message: 'Welcome, team lead or admin!' });
});

// Assign role - only admin can assign roles
app.post('/assign-role', authenticateToken, checkRole(['admin']), async (req, res) => {
    const { userId, role } = req.body;

    // Validate the role
    const validRoles = ['admin', 'employee', 'other'];
    if (!validRoles.includes(role)) {
        return res.status(400).json({ message: "Invalid role. Must be 'admin', 'employee', or 'other'." });
    }

    try {
        const [users] = await connection.query('SELECT * FROM Users WHERE id = ?', [userId]);

        // Check if user exists
        if (users.length === 0) {
            return res.status(404).json({ message: "User not found." });
        }

        // Update the user's role
        await connection.query('UPDATE Users SET role = ? WHERE id = ?', [role, userId]);

        res.status(200).json({ message: `Role updated to ${role} for user ${users[0].username}.` });
    } catch (error) {
        console.error("Error assigning role:", error);
        res.status(500).json({ message: "Error assigning role." });
    }
});

// Protected route example
app.get('/protected', authenticateToken, (req, res) => {
    res.json({
        message: "This is a protected route",
        user: { id: req.user.id, role: req.user.role }
    });
});

// Logout (Invalidate refresh token)
app.post('/logout', (req, res) => {
    const { token } = req.body;
    refreshTokens = refreshTokens.filter(rt => rt !== token);
    res.json({ message: 'Logout successful' });
});

// Set up Nodemailer
const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

// Request password reset
app.post('/forgot-password', async (req, res) => {
    const { email } = req.body;

    try {
        const [user] = await connection.query('SELECT * FROM Users WHERE email = ?', [email]);
        if (user.length === 0) {
            return res.status(404).json({ message: 'User not found.' });
        }

        const resetToken = crypto.randomBytes(32).toString('hex');
        const expiry = new Date(Date.now() + 3600000); // 1 hour expiration

        await connection.query('UPDATE Users SET resetToken = ?, resetTokenExpiry = ? WHERE id = ?', [resetToken, expiry, user[0].id]);

        const resetLink = `http://yourdomain.com/reset-password?token=${resetToken}`;
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Password Reset Request',
            text: `You requested a password reset. Click the link to reset your password: ${resetLink}`
        };

        await transporter.sendMail(mailOptions);
        res.json({ message: 'Password reset email sent.' });
    } catch (error) {
        console.error("Error sending reset email:", error);
        res.status(500).json({ message: 'Error requesting password reset.' });
    }
});

// Password reset route
app.post('/reset-password', async (req, res) => {
    const { token, newPassword } = req.body;

    try {
        const [user] = await connection.query('SELECT * FROM Users WHERE resetToken = ? AND resetTokenExpiry > NOW()', [token]);

        if (user.length === 0) {
            return res.status(400).json({ message: 'Invalid or expired token.' });
        }

        const hashedPassword = await bcrypt.hash(newPassword, saltRounds);
        await connection.query('UPDATE Users SET password = ?, resetToken = NULL, resetTokenExpiry = NULL WHERE id = ?', [hashedPassword, user[0].id]);

        res.json({ message: 'Password reset successfully.' });
    } catch (error) {
        console.error("Password reset error:", error);
        res.status(500).json({ message: 'Error resetting password.' });
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
