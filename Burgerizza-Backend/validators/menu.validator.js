// validators/menu.validator.js
const { body, validationResult } = require('express-validator');
const { sendError } = require('../utils/responseHandler');

const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const messages = errors.array().map(err => err.msg);
    return sendError(res, messages.join(' | '), 400);
  }
  next();
};

exports.validateMenu = [
  body('name')
    .notEmpty().withMessage('اسم الصنف مطلوب')
    .trim(),
  body('price')
    .isNumeric().withMessage('السعر يجب أن يكون رقماً')
    .isFloat({ min: 0 }).withMessage('السعر لا يمكن أن يكون سالباً'),
  body('category')
    .notEmpty().withMessage('التصنيف مطلوب')
    .trim(),
  body('description')
    .optional()
    .trim(),
  body('imageUrl')
    .optional()
    .trim()
    .isURL().withMessage('رابط الصورة غير صحيح'),
  body('isAvailable')
    .optional()
    .isBoolean().withMessage('isAvailable يجب أن يكون true أو false'),
  handleValidationErrors,
];