const express = require('express');
const router = express.Router();
const messageController = require('../controllers/messageControllers'); // Import the message controller
const authenticateToken = require('../middleware/auth'); // Import authentication middleware

// Route to send a message
router.post('/send', authenticateToken, messageController.sendMessage);

// Route to get messages for a specific recipient
router.get('/:recipientID', authenticateToken, messageController.getMessages);

module.exports = router;
