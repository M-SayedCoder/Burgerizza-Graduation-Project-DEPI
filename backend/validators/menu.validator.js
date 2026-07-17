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
    .if((value, { req }) => req.method === 'POST' || value !== undefined)
    .notEmpty().withMessage('اسم الصنف مطلوب')
    .trim(),
  body('price')
    .if((value, { req }) => req.method === 'POST' || value !== undefined)
    .isNumeric().withMessage('السعر يجب أن يكون رقماً')
    .isFloat({ min: 0 }).withMessage('السعر لا يمكن أن يكون سالباً'),
  body('category')
    .if((value, { req }) => req.method === 'POST' || value !== undefined)
    .notEmpty().withMessage('التصنيف مطلوب')
    .trim(),
  body('description')
    .optional()
    .trim(),
  body('imageUrl')
    .optional()
    .trim(),
  body('isAvailable')
    .optional()
    .customSanitizer(val => val === 'true' || val === '1' || val === true ? true : (val === 'false' || val === '0' || val === false ? false : val))
    .isBoolean().withMessage('isAvailable يجب أن يكون true أو false'),
  handleValidationErrors,
];
