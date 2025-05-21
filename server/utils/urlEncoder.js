// server/utils/urlEncoder.js

/**
 * Generates a random alphanumeric slug of specified length
 * @param {number} length - The length of the slug to generate
 * @returns {string} - Random alphanumeric string
 */
const generateRandomSlug = (length = 6) => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  
  return result;
};

/**
 * Encodes an integer ID to a Base62 string (A-Z, a-z, 0-9)
 * Useful for converting auto-incrementing IDs to short strings
 * @param {number} id - The numeric ID to encode
 * @returns {string} - Base62 encoded string
 */
const encodeBase62 = (id) => {
  const characters = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
  const base = characters.length;
  let encoded = '';
  
  // Convert to base62
  let num = id;
  do {
    encoded = characters[num % base] + encoded;
    num = Math.floor(num / base);
  } while (num > 0);
  
  return encoded;
};

/**
 * Validates if a URL is in the correct format
 * @param {string} url - URL to validate
 * @returns {boolean} - Whether the URL is valid
 */
const isValidUrl = (url) => {
  try {
    new URL(url);
    return true;
  } catch (err) {
    return false;
  }
};

/**
 * Validates a custom slug
 * @param {string} slug - The slug to validate
 * @returns {boolean} - Whether the slug is valid
 */
const isValidCustomSlug = (slug) => {
  // Only allow alphanumeric characters, hyphens, and underscores
  // Length between 3 and 20 characters
  const slugRegex = /^[a-zA-Z0-9_-]{3,20}$/;
  return slugRegex.test(slug);
};

module.exports = {
  generateRandomSlug,
  encodeBase62,
  isValidUrl,
  isValidCustomSlug
};