const express = require('express');
const mysql = require('mysql2');
//const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const dotenv = require('dotenv');
const crypto = require('crypto');
dotenv.config();

const app = express();
const port = 3000;
let refreshTokens = [];
const saltRounds = 10;

// Middleware
app.use(express.json());

// MySQL Connection
const db = mysql.createConnection({
    host: '127.0.0.1',
    user: 'workConnect', // replace with your MySQL username
    password: '9Zt#Q1p@', // replace with your MySQL password
    database: 'WorkConnectDB'
});

// Connect to MySQL
db.connect((err) => {
    if (err) {
        console.error('Error connecting to the database:', err);
        return;
    }
    console.log('Connected to MySQL database.');
});

// Root route
app.get('/', (req, res) => {
    res.send('Welcome to the WorkConnect API!');
});

// User Registration with async and default role
app.post('/register', async (req, res) => {
    const { username, email, password } = req.body;

    try {
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        const query = 'INSERT INTO users (username, email, password, role) VALUES (?, ?, ?, "employee")';
        
        db.query(query, [username, email, hashedPassword], (err, results) => {
            if (err) {
                if (err.code === 'ER_DUP_ENTRY') {
                    return res.status(409).json({ message: 'Username or email already exists.' });
                }
                console.error('Error registering user:', err);
                return res.status(500).json({ message: 'Error registering user.' });
            }
            res.status(201).json({ message: 'User registered successfully.', userId: results.insertId });
        });
    } catch (err) {
        console.error('Error processing registration:', err);
        res.status(500).json({ message: 'Error processing request.' });
    }
});

// Login route with refresh token creation
app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    console.log('Attempting to log in:', username);

    const query = 'SELECT * FROM users WHERE username = ?';
    db.query(query, [username], async (err, results) => {
        if (err) {
            console.error('Error logging in:', err);
            return res.status(500).json({ message: 'Error logging in.' });
        }

        console.log('DB query results:', results); // Log the results from the query

        if (results.length > 0) {
            const user = results[0];
            console.log('Found user:', user); // Log the user that was found

            // Log the stored password
            console.log('Stored password:', user.password);

            // Password comparison
            const match = await bcrypt.compare(password, user.password);
            console.log('Password match:', match); // Log whether password matches

            if (match) {
                // Log that the password is correct
                console.log('Password is correct. Generating tokens.');

                const accessToken = jwt.sign(
                    { id: user.id, role: user.role },
                    process.env.ACCESS_TOKEN_SECRET,
                    { expiresIn: '1h' }
                );

                const refreshToken = jwt.sign(
                    { id: user.id },
                    process.env.REFRESH_TOKEN_SECRET,
                    { expiresIn: '7d' }
                );

                // Log token creation
                console.log('Access token created:', accessToken);
                console.log('Refresh token created:', refreshToken);

                refreshTokens.push(refreshToken); // Store the refresh token
                return res.json({ message: 'Login successful', accessToken, refreshToken });
            } else {
                console.log('Invalid username or password.');
                res.status(401).json({ message: 'Invalid username or password.' });
            }
        } else {
            console.log('No user found with username:', username);
            res.status(404).json({ message: 'User not found.' });
        }
    });
});

// Refresh token route
app.post('/token', (req, res) => {
    const { token } = req.body;
    if (!token) return res.status(401).json({ message: 'Refresh token required' });
    
    if (!refreshTokens.includes(token)) return res.status(403).json({ message: 'Invalid refresh token' });

    jwt.verify(token, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
        if (err) return res.status(403).json({ message: 'Invalid token' });

        const accessToken = jwt.sign(
            { id: user.id, role: user.role },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: '1h' }
        );
        
        res.json({ accessToken });
    });
});

// Middleware to verify JWT token
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    console.log('Authorization Header:', authHeader); // Add this line
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        console.log('No token provided'); // Add this line
        return res.status(401).json({ message: 'Access denied, no token provided.' });
    }

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        if (err) {
            console.log('Token verification failed:', err); // Add this line
            return res.status(403).json({ message: 'Invalid token.' });
        }
        
        req.user = user;
        next();
    });
};

// Middleware to check user role from JWT
function checkRole(roles) {
    return (req, res, next) => {
        console.log('User role:', req.user.role); // Log the user's role
        if (roles.includes(req.user.role)) {
            next();
        } else {
            res.status(403).json({ message: 'Access denied.' });
        }
    };
}


// Example: Protect route with JWT and role-based access
app.get('/manage-team', authenticateToken, checkRole(['team lead', 'owner']), (req, res) => {
    res.json({ message: 'Welcome, team lead or owner!' });
});

// Assign role - only owner can assign roles
app.post('/assign-role', authenticateToken, checkRole(['owner']), (req, res) => {
    const { username, newRole } = req.body;
    const query = 'UPDATE users SET role = ? WHERE username = ?';
    db.query(query, [newRole, username], (err, results) => {
        if (err) {
            console.error('Error updating role:', err);
            return res.status(500).json({ message: 'Error updating role.' });
        }
        res.json({ message: `Role updated to ${newRole} for ${username}` });
    });
});


// Example protected route
app.get('/protected', authenticateToken, (req, res) => {
    res.json({
        message: "This is a protected route",
        user: { id: req.user.id, role: req.user.role } // Assuming req.user is set in authenticateToken middleware
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
app.post('/forgot-password', (req, res) => {
    const { email } = req.body;
    const query = 'SELECT * FROM users WHERE email = ?';

    db.query(query, [email], (err, results) => {
        if (err) {
            console.error('Error retrieving user:', err);
            return res.status(500).json({ message: 'Error retrieving user.' });
        }

        if (results.length > 0) {
            const user = results[0];
            const resetToken = crypto.randomBytes(32).toString('hex');
            const expiry = Date.now() + 3600000; // 1 hour expiration

            const updateQuery = 'UPDATE users SET resetToken = ?, resetTokenExpiry = ? WHERE email = ?';
            db.query(updateQuery, [resetToken, expiry, email], (err) => {
                if (err) {
                    console.error('Error updating user:', err);
                    return res.status(500).json({ message: 'Error updating user.' });
                }

                const resetLink = `http://yourwebsite.com/reset-password?token=${resetToken}`;
                const mailOptions = {
                    from: process.env.EMAIL_USER,
                    to: email,
                    subject: 'Password Reset Request',
                    text: `You requested a password reset. Click the link to reset your password: ${resetLink}`
                };

                transporter.sendMail(mailOptions, (err, info) => {
                    if (err) {
                        console.error('Error sending email:', err);
                        return res.status(500).json({ message: 'Error sending email.' });
                    }
                    res.json({ message: 'Password reset link sent to your email.' });
                });
            });
        } else {
            res.status(404).json({ message: 'User not found.' });
        }
    });
});

// Reset password
app.post('/reset-password', async (req, res) => {
    const { token, newPassword } = req.body;

    const query = 'SELECT * FROM users WHERE resetToken = ? AND resetTokenExpiry > ?';
    db.query(query, [token, Date.now()], async (err, results) => {
        if (err) {
            console.error('Error retrieving user:', err);
            return res.status(500).json({ message: 'Error retrieving user.' });
        }

        if (results.length > 0) {
            const hashedPassword = await bcrypt.hash(newPassword, saltRounds);
            const updateQuery = 'UPDATE users SET password = ?, resetToken = NULL, resetTokenExpiry = NULL WHERE resetToken = ?';
            db.query(updateQuery, [hashedPassword, token], (err) => {
                if (err) {
                    console.error('Error updating password:', err);
                    return res.status(500).json({ message: 'Error updating password.' });
                }
                res.json({ message: 'Password updated successfully.' });
            });
        } else {
            res.status(400).json({ message: 'Invalid or expired token.' });
        }
    });
});

// Start server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
