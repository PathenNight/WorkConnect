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
const port = process.env.PORT || 443;
const useHttps = process.env.USE_HTTPS === 'true';
let refreshTokens = [];
const saltRounds = 10;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Database connection setup
const createConnection = require('./config/db');

// Create Users and UserGroups tables if they don't exist
require('./config/setupDatabase')();

// HTTPS Server Setup
if (useHttps) {
    const httpsOptions = {
        key: fs.readFileSync(path.join(__dirname, 'certificates', 'server.key')),
        cert: fs.readFileSync(path.join(__dirname, 'certificates', 'server.cert'))
    };

    const httpsServer = https.createServer(httpsOptions, app);
    httpsServer.listen(port, '0.0.0.0', () => {
        console.log(`HTTPS server is running on https://localhost:${port}`);
    });
} else {
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
