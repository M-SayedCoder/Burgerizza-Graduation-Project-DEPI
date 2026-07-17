/**
/**
 * Utility functions to send standardized JSON responses.
 * Supports both Mohamed's and Shehab's parameter conventions to prevent runtime errors.
 */

/**
 * Send a success response.
 * @param {Object} res - Express response object
 * @param {string} message - Success description message
 * @param {*} [data=null] - Payload data
 * @param {number} [statusCode=200] - HTTP status code
 */
const sendSuccess = (res, message, data = null, statusCode = 200) => {
  return res.status(statusCode).json({
    success: true,
    message,
    data
  });
};

/**
 * Send an error response.
 * Flexibly detects argument ordering to support:
 * - Mohamed style: sendError(res, message, errors, statusCode)
 * - Shehab style: sendError(res, message, statusCode, errors)
 */
const sendError = (res, message, param3 = null, param4 = null) => {
  let statusCode = 500;
  let errors = [];

  if (typeof param3 === 'number') {
    // Shehab style: sendError(res, message, statusCode, errors)
    statusCode = param3;
    errors = param4;
  } else {
    // Mohamed style: sendError(res, message, errors, statusCode)
    errors = param3;
    if (typeof param4 === 'number') {
      statusCode = param4;
    }
  }

  // Ensure errors is an array
  let errorsArray = [];
  if (Array.isArray(errors)) {
    errorsArray = errors;
  } else if (errors !== null && errors !== undefined) {
    if (typeof errors === 'object') {
      errorsArray = [errors];
    } else {
      errorsArray = [{ message: errors.toString() }];
    }
  }

  return res.status(statusCode).json({
    success: false,
    message,
    errors: errorsArray
  });
};

module.exports = {
  sendSuccess,
  sendError
};
