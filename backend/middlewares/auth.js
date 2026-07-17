const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { sendError } = require('../utils/responseHandler');

/**
 * JWT Authentication Middleware.
 * Decodes the token, loads the user from MongoDB, and attaches it to req.user.
 * Bypasses are removed for security.
 */
const authenticateJWT = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return sendError(res, 'Access denied. No token provided.', null, 401);
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'burgeriza_secret_key');
    
    const user = await User.findById(decoded.id || decoded.userId);
    if (!user) {
      return sendError(res, 'User not found.', null, 401);
    }

    req.user = user;
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return sendError(res, 'Token has expired.', null, 401);
    }
    return sendError(res, 'Invalid token.', null, 401);
  }
};

/**
 * Role Authorization Middleware.
 * Restricts access to specified roles.
 */
const authorizeRoles = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      return sendError(res, `Forbidden. Role '${req.user ? req.user.role : 'none'}' does not have access.`, null, 403);
    }
    next();
  };
};

module.exports = {
  authenticateJWT,
  protect: authenticateJWT,
  authorizeRoles,
  authorize: authorizeRoles
};
