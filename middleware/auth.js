const jwt = require('jsonwebtoken');

const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    console.log('Authorization Header:', authHeader); // Log the authorization header

    const token = authHeader && authHeader.split(' ')[1];
    console.log('Extracted Token:', token); // Log the token

    if (!token) {
        return res.status(401).json({ error: 'Token missing or invalid' });
    }

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        if (err) {
            console.log('JWT verification failed:', err); // Log any verification errors
            return res.status(403).json({ error: 'Token invalid or expired' });
        }
        console.log('JWT verification succeeded. User:', user); // Log the decoded user data
        req.user = user;
        next();
    });
};

module.exports = authenticateToken;