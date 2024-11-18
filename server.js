const express = require('express');
const mysql = require('mysql2/promise');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const dotenv = require('dotenv');
const fs = require('fs');
const path = require('path');
const https = require('https');

dotenv.config();

const app = express();
const port = process.env.PORT || 443; // Default to HTTPS port
const useHttps = process.env.USE_HTTPS === 'true';
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
if (useHttps) {
    const httpsOptions = {
        key: fs.readFileSync(path.join(__dirname, 'certificates', 'server.key')), // Relative path to SSL key
        cert: fs.readFileSync(path.join(__dirname, 'certificates', 'server.cert')) // Relative path to SSL cert
    };

    const httpsServer = https.createServer(httpsOptions, app);

    // Listen on all network interfaces to allow external access
    httpsServer.listen(port, '0.0.0.0', () => {
        console.log(`HTTPS server is running on https://localhost:${port}`);
    });
} else {
    // Fallback to HTTP if USE_HTTPS is not enabled
    app.listen(port, '0.0.0.0', () => {
        console.log(`HTTP server is running on http://localhost:${port}`);
    });
}

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
