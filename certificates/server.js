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

// Initialize the database and create tables
(async () => {
    try {
        const setupDatabase = require('./config/setupDatabase');
        await setupDatabase(); // Ensures tables are created
        console.log('Database setup complete.');
    } catch (error) {
        console.error('Failed to set up the database:', error.message);
        process.exit(1); // Exit process if the database setup fails
    }
})();

// HTTPS Server Setup
if (useHttps) {
    try {
        const httpsOptions = {
            key: fs.readFileSync(path.join(__dirname, 'certificates', 'server.key')), // SSL key path
            cert: fs.readFileSync(path.join(__dirname, 'certificates', 'server.cert')) // SSL cert path
        };

        const httpsServer = https.createServer(httpsOptions, app);

        // Listen on all network interfaces to allow external access
        httpsServer.listen(port, '0.0.0.0', () => {
            console.log(`HTTPS server is running on https://localhost:${port}`);
        });
    } catch (error) {
        console.error('Failed to start HTTPS server:', error.message);
        process.exit(1);
    }
} else {
    // Fallback to HTTP if USE_HTTPS is not enabled
    app.listen(port, '0.0.0.0', () => {
        console.log(`HTTP server is running on http://localhost:${port}`);
    });
}

// Import and use routes
const authRoutes = require('./routes/auth');
const passwordRoutes = require('./routes/password');
const messageRoutes = require('./routes/message');
const calendarRoutes = require('./routes/calendar');

app.use('/auth', authRoutes);
app.use('/auth/password', passwordRoutes);
app.use('/auth/messages', messageRoutes);
app.use('/auth/calendar', calendarRoutes);

// Root route for server verification
app.get('/', (req, res) => {
    res.send('Welcome to the WorkConnect backend!');
});

// Global error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Internal server error' });
});

// Graceful shutdown handling
process.on('SIGINT', () => {
    console.log('Shutting down server...');
    process.exit(0);
});
