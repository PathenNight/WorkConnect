const jwt = require('jsonwebtoken');

const authenticateToken = (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1];
    if (!token) {
        return res.status(401).json({ message: 'Token required' });
    }

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        if (err) {
            console.error('Token verification error:', err); // Add logging for errors
            return res.status(403).json({ message: 'Invalid or expired token' });
        }
        req.user = user; // Attach user info to request object
        next(); // Pass control to the next middleware/route handler
    });
};

module.exports = authenticateToken;
