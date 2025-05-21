// server/middleware/validateUrl.js
const { isValidUrl, isValidCustomSlug } = require('../utils/urlEncoder');

/**
 * Middleware to validate URL and slug inputs
 */
const validateUrlRequest = (req, res, next) => {
  const { url, customSlug } = req.body;
  
  // Check if URL exists and is valid
  if (!url) {
    return res.status(400).json({ 
      success: false, 
      message: 'URL is required' 
    });
  }
  
  if (!isValidUrl(url)) {
    return res.status(400).json({ 
      success: false, 
      message: 'Invalid URL format. Please provide a valid URL including http:// or https://' 
    });
  }
  
  // If custom slug is provided, validate it
  if (customSlug && !isValidCustomSlug(customSlug)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid custom slug. Use only letters, numbers, hyphens, and underscores (3-20 characters)'
    });
  }
  
  next();
};

module.exports = { validateUrlRequest };

