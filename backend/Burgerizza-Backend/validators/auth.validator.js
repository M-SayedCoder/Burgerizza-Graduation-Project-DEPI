// validators/auth.validator.js
const { body, validationResult } = require('express-validator');
const { sendError } = require('../utils/responseHandler');

// دالة للتعامل مع أخطاء التحقق
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const messages = errors.array().map(err => err.msg);
    return sendError(res, messages.join(' | '), 400);
  }
  next();
};

// التحقق من التسجيل
exports.validateRegister = [
  body('name')
    .notEmpty().withMessage('الاسم مطلوب')
    .isLength({ min: 2 }).withMessage('الاسم يجب أن يكون حرفين على الأقل')
    .trim(),
  body('email')
    .isEmail().withMessage('البريد الإلكتروني غير صحيح')
    .normalizeEmail(),
  body('password')
    .isLength({ min: 6 }).withMessage('كلمة المرور يجب أن تكون 6 أحرف على الأقل'),
  body('phone')
    .optional()
    .matches(/^[0-9]{10,15}$/).withMessage('رقم الهاتف غير صحيح (10-15 رقم)'),
  body('role')
    .optional()
    .isIn(['customer', 'manager', 'admin']).withMessage('دور غير صحيح'),
  handleValidationErrors,
];

// التحقق من تسجيل الدخول
exports.validateLogin = [
  body('email')
    .isEmail().withMessage('البريد الإلكتروني غير صحيح')
    .normalizeEmail(),
  body('password')
    .notEmpty().withMessage('كلمة المرور مطلوبة'),
  handleValidationErrors,
];