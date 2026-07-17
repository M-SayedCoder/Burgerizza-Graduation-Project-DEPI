// middlewares/auth.js
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { sendError } = require('../utils/responseHandler');

const protect = async (req, res, next) => {
  let token;
  if (req.headers.authorization?.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }
  if (!token) return sendError(res, 'غير مصرح', 401);

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select('-passwordHash');
    if (!user) return sendError(res, 'المستخدم غير موجود', 401);
    req.user = user;
    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError')
      return sendError(res, 'انتهت الصلاحية', 401);
    return sendError(res, 'توكن غير صالح', 401);
  }
};

const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) return sendError(res, 'غير مصرح', 401);
    if (!roles.includes(req.user.role))
      return sendError(res, `دور "${req.user.role}" غير مسموح`, 403);
    next();
  };
};

module.exports = { protect, authorize };