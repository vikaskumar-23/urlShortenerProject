// server/middleware/errorHandler.js
/**
 * Global error handling middleware
 */
const errorHandler = (err, req, res, next) => {
  console.error(`Error: ${err.message}`);
  console.error(err.stack);
  
  // Mongoose duplicate key error (E11000)
  if (err.code === 11000) {
    return res.status(409).json({
      success: false,
      message: 'Custom slug already in use. Please choose another one.',
    });
  }
  
  // Default server error
  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || 'Server Error',
  });
};

module.exports = { errorHandler };