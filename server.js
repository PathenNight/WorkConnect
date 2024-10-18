const express = require('express');
const mysql = require('mysql2/promise');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const dotenv = require('dotenv');
const fs = require('fs');
const https = require('https');

dotenv.config();

const app = express();
const port = 443; // HTTPS port
let refreshTokens = [];
const saltRounds = 10;

// Middleware
app.use(express.json()); // for parsing application/json
app.use(express.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

// Database connection setup
const createConnection = require('./config/db');

// Create Users and UserGroups tables if they don't exist
require('./config/setupDatabase')();

// HTTPS Server Setup
const httpsOptions = {
    key: fs.readFileSync('C:\\Windows\\System32\\server.key'),  // Path to your SSL key
    cert: fs.readFileSync('C:\\Windows\\System32\\server.cert') // Path to your SSL cert
};

const httpsServer = https.createServer(httpsOptions, app);

// Listen on all network interfaces to allow external access
httpsServer.listen(port, '0.0.0.0', () => {
    console.log(`HTTPS server is running on https://localhost:${port}`);
});

// Import routes
const authRoutes = require('./routes/auth');
const passwordRoutes = require('./routes/password');

// Use routes
app.use('/auth', authRoutes);
app.use('/password', passwordRoutes);

// Server Verification
app.get('/', (req, res) => {
    res.send('Welcome to the WorkConnect backend!');
});

// Server error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Internal server error' });
});
