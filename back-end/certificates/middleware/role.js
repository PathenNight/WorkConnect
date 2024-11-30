const authorizeRole = (allowedRoles) => {
    return (req, res, next) => {
        // Check if the user has one of the allowed roles
        if (!allowedRoles.includes(req.user.role)) {
            console.error(`Access denied for user ${req.user.username} with role ${req.user.role}`);
            return res.status(403).json({ message: 'Access denied: insufficient role' });
        }
        next(); // If user role is valid, continue to next middleware/route handler
    };
};

module.exports = authorizeRole;
