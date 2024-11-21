const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const createConnection = require('../config/db');
const authController = require('../controllers/authController');
const router = express.Router();

// User Registration Route
router.post('/register', authController.register);

// Login Route
router.post('/login', authController.login);

// Refresh token route
router.post('/token', authController.refreshToken);

// Logout (Invalidate refresh token)
router.post('/logout', authController.logout);

module.exports = router;
