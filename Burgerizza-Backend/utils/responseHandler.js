// utils/responseHandler.js
exports.sendSuccess = (res, message, data = null, statusCode = 200) => {
  res.status(statusCode).json({
    success: true,
    message,
    data,
  });
};

exports.sendError = (res, message, statusCode = 400, errors = null) => {
  res.status(statusCode).json({
    success: false,
    message,
    errors,
  });
};