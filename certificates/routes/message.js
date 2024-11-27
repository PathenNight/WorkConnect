const express = require('express');
const router = express.Router();
const messageController = require('../controllers/messageControllers');
const authenticateToken = require('../middleware/auth');

// Route to send a message
router.post('/send', authenticateToken, async (req, res, next) => {
    try {
        console.log('POST /auth/messages/send triggered');
        await messageController.sendMessage(req, res);
    } catch (error) {
        console.error(error);
        next(error); // If any error occurs, forward it to the next middleware
    }
});

// Route to get messages for a specific recipient
router.get('/:recipientID', authenticateToken, async (req, res, next) => {
    try {
        console.log(`GET /auth/messages/${req.params.recipientID} triggered`);
        await messageController.getMessages(req, res);
    } catch (error) {
        console.error(error);
        next(error);
    }
});

module.exports = router;
