/**
 * Utility functions to send standardized JSON responses.
 */

/**
 * Send a success response.
 * @param {Object} res - Express response object
 * @param {string} message - Success message
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
 * @param {Object} res - Express response object
 * @param {string} message - Error description message
 * @param {*} [errors=null] - Specific validation errors or details
 * @param {number} [statusCode=500] - HTTP status code
 */
const sendError = (res, message, errors = null, statusCode = 500) => {
  return res.status(statusCode).json({
    success: false,
    message,
    errors
  });
};

module.exports = {
  sendSuccess,
  sendError
};
