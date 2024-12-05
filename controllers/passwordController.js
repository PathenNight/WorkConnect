const nodemailer = require('nodemailer');
const crypto = require('crypto');
const bcrypt = require('bcrypt'); // Add bcrypt import
const createConnection = require('../config/db');

// Set up Nodemailer
const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

// Request password reset logic
const forgotPassword = async (req, res) => {
    const { email } = req.body;
    const connection = await createConnection();

    try {
        const [user] = await connection.query('SELECT * FROM Users WHERE email = ?', [email]);
        if (user.length === 0) {
            return res.status(404).json({ message: 'User not found' });
        }

        const resetToken = crypto.randomBytes(32).toString('hex');
        const hashedResetToken = crypto.createHash('sha256').update(resetToken).digest('hex'); // Hash the token before saving
        const expiry = new Date(Date.now() + 3600000); // 1 hour

        await connection.query('UPDATE Users SET resetToken = ?, resetTokenExpiry = ? WHERE email = ?', [hashedResetToken, expiry, email]);

        const resetUrl = `http://yourdomain.com/reset/${resetToken}`; // Make sure to replace yourdomain.com with your actual domain
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Password Reset',
            text: `You requested a password reset. Click here to reset your password: ${resetUrl}`
        };

        await transporter.sendMail(mailOptions);
        res.json({ message: 'Password reset link sent to your email.' });
    } catch (error) {
        console.error("Password reset error:", error);
        res.status(500).json({ message: 'Error requesting password reset.' });
    } finally {
        await connection.end(); // Close the connection
    }
};

// Reset password logic
const resetPassword = async (req, res) => {
    const { token, newPassword } = req.body;
    const connection = await createConnection();

    try {
        const hashedToken = crypto.createHash('sha256').update(token).digest('hex'); // Hash the token for verification
        const [user] = await connection.query('SELECT * FROM Users WHERE resetToken = ? AND resetTokenExpiry > NOW()', [hashedToken]);
        if (user.length === 0) {
            return res.status(400).json({ message: 'Invalid or expired token' });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        await connection.query('UPDATE Users SET password = ?, resetToken = NULL, resetTokenExpiry = NULL WHERE id = ?', [hashedPassword, user[0].id]);
        res.json({ message: 'Password reset successfully.' });
    } catch (error) {
        console.error("Error resetting password:", error);
        res.status(500).json({ message: 'Error resetting password.' });
    } finally {
        await connection.end(); // Close the connection
    }
};

// Recovery by Key
const recoverByKey = async (req, res) => {
    const { recoveryKey } = req.body;
    const connection = await createConnection();

    try {
        const [user] = await connection.query('SELECT * FROM Users WHERE recoveryKey = ?', [recoveryKey]);
        if (user.length === 0) {
            return res.status(404).json({ found: false });
        }

        // Return email (you may want to return a masked password or other info)
        res.json({ found: true, email: user[0].email });
    } catch (error) {
        console.error("Error recovering by key:", error);
        res.status(500).json({ message: 'Error recovering account.' });
    } finally {
        await connection.end();
    }
};

// Recovery by Email
const recoverByEmail = async (req, res) => {
    const { email } = req.body;
    const connection = await createConnection();

    try {
        const [user] = await connection.query('SELECT * FROM Users WHERE email = ?', [email]);
        if (user.length === 0) {
            return res.status(404).json({ found: false });
        }

        // Send the security question (this would need to be part of your Users table)
        res.json({ found: true, securityQuestion: user[0].securityQuestion });
    } catch (error) {
        console.error("Error recovering by email:", error);
        res.status(500).json({ message: 'Error recovering account.' });
    } finally {
        await connection.end();
    }
};

// Verify Security Question Answer
const verifyAnswer = async (req, res) => {
    const { email, answer } = req.body;
    const connection = await createConnection();

    try {
        const [user] = await connection.query('SELECT * FROM Users WHERE email = ?', [email]);
        if (user.length === 0) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Hash the input answer and compare with the stored hashed answer
        const isAnswerCorrect = await bcrypt.compare(answer, user[0].securityAnswer);
        if (isAnswerCorrect) {
            res.json({ correct: true });
        } else {
            res.status(400).json({ correct: false });
        }
    } catch (error) {
        console.error("Error verifying answer:", error);
        res.status(500).json({ message: 'Error verifying answer.' });
    } finally {
        await connection.end();
    }
};


module.exports = {
    forgotPassword,
    resetPassword,
    recoverByKey,   // Ensure recoverByKey is exported
    recoverByEmail, // Ensure recoverByEmail is exported
    verifyAnswer
};

