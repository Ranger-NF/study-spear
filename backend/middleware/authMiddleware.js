import jwt from 'jsonwebtoken';

/**
 * Middleware to authenticate token
 * Optional: pass { optional: true } as third parameter to make auth optional
 */
const authenticateToken = (req, res, next, options = {}) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1];
  
  // If no token is provided
  if (!token) {
    // For optional auth, continue without user
    if (options.optional) {
      return next();
    }
    return res.status(401).json({
      success: false,
      message: 'Access denied. No token provided.'
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    if (options.optional) {
      next();
    } else {
      res.status(403).json({
        success: false,
        message: 'Invalid token.'
      });
    }
  }
};

export default authenticateToken;