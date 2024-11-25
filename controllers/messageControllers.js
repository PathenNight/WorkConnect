const createConnection = require('../config/db'); // Ensure your DB config is reusable

// Send a message (POST)
exports.sendMessage = async (req, res) => {
    const { senderID, recipientID, messageContents } = req.body;

    // Ensure all fields are provided
    if (!senderID || !recipientID || !messageContents) {
        return res.status(400).json({ error: 'All fields are required.' });
    }

    try {
        const db = await createConnection(); // Create a connection to the database
        const [result] = await db.query(
            "INSERT INTO Messages (senderID, recipientID, messageContents) VALUES (?, ?, ?)",
            [senderID, recipientID, messageContents]
        );
        await db.end(); // Close the connection

        res.status(201).json({ message: 'Message sent successfully!', messageID: result.insertId });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to send message.' });
    }
};

// Get messages for a recipient (GET)
exports.getMessages = async (req, res) => {
    const { recipientID } = req.params;

    // Ensure recipientID is provided
    if (!recipientID) {
        return res.status(400).json({ error: 'Recipient ID is required.' });
    }

    try {
        const db = await createConnection(); // Create a connection to the database
        const [messages] = await db.query(
            "SELECT * FROM Messages WHERE recipientID = ?",
            [recipientID]
        );
        await db.end(); // Close the connection

        // Check if messages exist for the recipient
        if (messages.length === 0) {
            return res.status(404).json({ error: 'No messages found for this recipient.' });
        }

        res.status(200).json(messages);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to retrieve messages.' });
    }
};
