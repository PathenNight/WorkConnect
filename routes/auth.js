const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const createConnection = require('../config/db');
const authController = require('../controllers/authController');
const router = express.Router();
const calendarRoutes = require('./calendar');

// User Registration Route
router.post('/register', authController.register);

// Login Route
router.post('/login', authController.login);

// Refresh token route
router.post('/token', authController.refreshToken);

// Logout (Invalidate refresh token)
router.post('/logout', authController.logout);

// Calendar Routes (includes tasks and projects)
router.use('/calendar', calendarRoutes);

module.exports = router;