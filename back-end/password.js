const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const passwordController = require('../controllers/passwordController');
const router = express.Router();

// Request password reset
router.post('/forgot', passwordController.forgotPassword);

// Reset password
router.post('/reset', passwordController.resetPassword);

// Login route
router.post('/login', async (req, res) => {
    const { username, password } = req.body;
  
    if (!username || !password) {
      return res.status(400).json({ success: false, message: 'Username and password are required' });
    }
  
    try {
      const [rows] = await db.query('SELECT * FROM Users WHERE username = ?', [username]);
  
      if (rows.length === 0) {
        return res.status(401).json({ success: false, message: 'Invalid username or password' });
      }
  
      const user = rows[0];
      const isPasswordValid = await bcrypt.compare(password, user.password);
  
      if (!isPasswordValid) {
        return res.status(401).json({ success: false, message: 'Invalid username or password' });
      }
      
      const token = jwt.sign({ id: user.id, username: user.username }, process.env.JWT_SECRET, { expiresIn: '1h' });
  
      res.json({ success: true, message: 'Login successful', token });
    } catch (error) {
      console.error('Error during login:', error);
      res.status(500).json({ success: false, message: 'Internal server error' });
    }
  });

module.exports = router;
