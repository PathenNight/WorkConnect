const express = require('express');
const mysql = require('mysql2/promise');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const dotenv = require('dotenv');
const fs = require('fs');
const path = require('path');
const https = require('https');
const helmet = require('helmet');
const compression = require('compression');
const cors = require('cors');
const bodyParser = require('body-parser');
const authRoutes = require('./routes/auth');  // Import the auth routes

dotenv.config();

const app = express();
const port = process.env.PORT || 3000; // Default port
const useHttps = process.env.USE_HTTPS === 'true';  // Use HTTPS based on environment variable
const refreshTokens = new Set(); // Secure set for refresh tokens
const saltRounds = 10;

// Validate critical environment variables
if (!process.env.SECRET_KEY || !process.env.DB_HOST) {
    console.error('Error: Missing required environment variables. Check your .env file.');
    process.exit(1); // Exit if necessary environment variables are missing
}

// Middleware
app.use(helmet()); // Adds security headers
app.use(compression()); // Compresses responses
app.use(express.json()); // Parses JSON request bodies
app.use(express.urlencoded({ extended: true })); // Parses URL-encoded request bodies
app.use(express.static(path.join(__dirname, 'Frontend'))); // Serves static files (Frontend)
app.use(cors({
    origin: 'http://localhost:3000', // React dev server
    credentials: true, // Allow cookies if necessary for auth
}));

// Database connection setup
const createConnection = require('./config/db');

// Initialize the database and create tables
(async () => {
    try {
        const setupDatabase = require('./config/setupDatabase');
        await setupDatabase(); // Ensures tables are created if needed
        console.log('Database setup complete.');
    } catch (error) {
        console.error('Database setup failed:', error.stack);
        process.exit(1); // Exit if database setup fails
    }
})();

// HTTPS Server Setup
if (useHttps) {
    try {
        const httpsOptions = {
            key: fs.readFileSync(path.join(__dirname, 'certificates', 'server.key')), // SSL key
            cert: fs.readFileSync(path.join(__dirname, 'certificates', 'server.cert')), // SSL certificate
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

// Import and use other routes (password, message, calendar)
const passwordRoutes = require('./routes/password');
const messageRoutes = require('./routes/message');
const calendarRoutes = require('./routes/calendar');

// Use consistent API prefixes for routes
app.use('/api/auth', authRoutes);
app.use('/api/auth/password', passwordRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/calendar', calendarRoutes);

// Root route for server verification (works if accessing / directly)
app.get('/', (req, res) => {
    res.send('Welcome to the WorkConnect backend!');
});

// Global error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Internal server error' });
});

// Graceful shutdown handling for SIGINT (Ctrl+C)
process.on('SIGINT', () => {
    console.log('Shutting down server...');
    process.exit(0);
});
