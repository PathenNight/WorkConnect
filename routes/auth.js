const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const createConnection = require('../config/db');
const authController = require('../controllers/authController');
const router = express.Router();
const calendarRoutes = require('./calendar');
const { addTask } = require('../controllers/taskController');  // Corrected import path
const { recoverByKey, recoverByEmail, verifyAnswer } = require('../controllers/passwordController');
const { getSecurityQuestions } = require('../controllers/authController');  // Make sure this import is correct

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

// Add a task
router.post('/', addTask);  // use addTask directly here, no need for taskController.

router.post('/recover-by-key', recoverByKey);
router.post('/recover-by-email', recoverByEmail);
router.post('/verify-answer', verifyAnswer);

router.get('/security-questions', getSecurityQuestions);

router.put('/update/:id', authController.updateUser);

module.exports = router;
