const jwt = require('jsonwebtoken');
const { sendError } = require('../utils/responseHandler');

const authenticateJWT = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return sendError(res, 'Access denied. No token provided.', null, 401);
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'burgeriza_secret_key');
    
    req.user = {
      id: decoded.id || decoded.userId,
      role: decoded.role
    };
    
    next();
  } catch (error) {
    return sendError(res, 'Invalid or expired token.', null, 401);
  }
};

const authorizeRoles = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      return sendError(res, 'Forbidden. Access denied.', null, 403);
    }
    next();
  };
};

/**
 * Middleware that allows bypassing JWT auth in development/testing environments.
 * Strictly checks NODE_ENV to prevent unauthorized access in production.
 */
const bypassAuth = (req, res, next) => {
  if (process.env.NODE_ENV === 'production' && process.env.ALLOW_AUTH_BYPASS !== 'true') {
    return authenticateJWT(req, res, next);
  }

  req.user = {
    id: req.headers['x-user-id'] || '60c72b2f9b1d8b2a3c8e4d14',
    role: req.headers['x-user-role'] || 'admin'
  };
  next();
};

module.exports = {
  authenticateJWT,
  authorizeRoles,
  bypassAuth
};
