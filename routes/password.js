const express = require('express');
const passwordController = require('../controllers/passwordController');
const router = express.Router();

// Request password reset
router.post('/forgot', passwordController.forgotPassword);

// Reset password
router.post('/reset', passwordController.resetPassword);

module.exports = router;
