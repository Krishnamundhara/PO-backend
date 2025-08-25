const jwt = require('jsonwebtoken');

module.exports = {
  // Authentication middleware
  auth: (req, res, next) => {
    try {
      const token = req.header('Authorization')?.replace('Bearer ', '');
      
      if (!token) {
        return res.status(401).json({ message: 'Authentication required' });
      }
      
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded;
      next();
    } catch (err) {
      res.status(401).json({ message: 'Invalid or expired token' });
    }
  },
  
  // Admin role authorization middleware
  adminAuth: (req, res, next) => {
    try {
      if (req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Admin privileges required' });
      }
      next();
    } catch (err) {
      res.status(403).json({ message: 'Access denied' });
    }
  }
};
