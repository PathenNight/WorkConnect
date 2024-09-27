const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const app = express();
const port = 3000;

// Middleware
app.use(bodyParser.json());

// MySQL Connection
const db = mysql.createConnection({
    host: '127.0.0.1', // your Host
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

// User Registration
app.post('/register', (req, res) => {
    const { username, email } = req.body;
    const query = 'INSERT INTO users (username, email) VALUES (?, ?)';
    db.query(query, [username, email], (err, results) => {
        if (err) {
            console.error('Error registering user:', err);
            return res.status(500).json({ message: 'Error registering user.' });
        }
        res.status(201).json({ message: 'User registered successfully.', userId: results.insertId });
    });
});

// User Login
app.post('/login', (req, res) => {
    const { username } = req.body;
    const query = 'SELECT * FROM users WHERE username = ?';
    db.query(query, [username], (err, results) => {
        if (err) {
            console.error('Error logging in:', err);
            return res.status(500).json({ message: 'Error logging in.' });
        }
        if (results.length > 0) {
            res.json({ message: 'Login successful', user: results[0] });
        } else {
            res.status(404).json({ message: 'User not found.' });
        }
    });
});

// Logout
app.post('/logout', (req, res) => {
    // This route doesn't require any body, just informs the client to logout
    res.json({ message: 'Logout successful. Please delete your token on the client side.' });
});

// Get User Profile
app.get('/profile/:username', (req, res) => {
    const username = req.params.username;
    const query = 'SELECT * FROM users WHERE username = ?';
    db.query(query, [username], (err, results) => {
        if (err) {
            console.error('Error retrieving user profile:', err);
            return res.status(500).json({ message: 'Error retrieving profile.' });
        }
        if (results.length > 0) {
            res.json(results[0]);
        } else {
            res.status(404).json({ message: 'User not found.' });
        }
    });
});

// Delete User
app.delete('/delete/:username', (req, res) => {
    const username = req.params.username;
    const query = 'DELETE FROM users WHERE username = ?';
    db.query(query, [username], (err, results) => {
        if (err) {
            console.error('Error deleting user:', err);
            return res.status(500).json({ message: 'Error deleting user.' });
        }
        if (results.affectedRows > 0) {
            res.json({ message: 'User deleted successfully.' });
        } else {
            res.status(404).json({ message: 'User not found.' });
        }
    });
});

// Start the Server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
