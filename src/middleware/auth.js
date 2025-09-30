const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
 // Get token from header
  const token = req.header('x-auth-token');

  // Check if no token
  if (!token) {
    return res.status(401).json({ message: 'No token, authorization denied' });
  }

  // Verify token
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('🔐 Decoded token:', decoded); // Add this log
    req.user = decoded;
    next();
  } catch (err) {
    console.error('❌ Token verification failed:', err);
    res.status(401).json({ message: 'Token is not valid' });
  }
};

module.exports = verifyToken;
