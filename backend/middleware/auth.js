const jwt = require('jsonwebtoken');

const auth = (req, res, next) => {
  // Try different ways to read header for compatibility
  const authHeader = req.headers['authorization'] || req.headers['Authorization'] || req.header && req.header('Authorization');
  let token = null;
  if (authHeader && typeof authHeader === 'string') {
    token = authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : authHeader;
  } else if (req.headers && req.headers.authorization) {
    token = req.headers.authorization.replace('Bearer ', '');
  }

  if (!token) {
    return res.status(401).json({ message: 'No token, authorization denied' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_jwt_secret');
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Token is not valid' });
  }
};

const adminAuth = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ message: 'No token, authorization denied' });
  }
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Admin access required' });
  }
  next();
};

module.exports = { auth, adminAuth };
