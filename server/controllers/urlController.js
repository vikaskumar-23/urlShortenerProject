const Url = require('../models/Url');
const { generateRandomSlug, encodeBase62 } = require('../utils/urlEncoder');

// Create a counter collection for auto-incrementing IDs
let nextId = 1; // Fallback if counter collection is not used

/**
 * Create a shortened URL
 * @route POST /api/url/shorten
 */
const createShortUrl = async (req, res) => {
  try {
    const { url, customSlug, expiryDays } = req.body;
    
    // Check if the URL already exists in the database
    const existingUrl = await Url.findOne({ originalUrl: url, customSlug: false });
    if (existingUrl && !customSlug) {
      // If URL already exists and user didn't request a custom slug, return the existing one
      return res.status(200).json({
        success: true,
        shortUrl: existingUrl.slug,
        originalUrl: existingUrl.originalUrl,
        expiresAt: existingUrl.expiresAt,
        message: 'URL has already been shortened'
      });
    }
    
    // Determine expiration date if provided
    let expiresAt = null;
    if (expiryDays) {
      expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + parseInt(expiryDays));
    }
    
    // Generate or use custom slug
    let slug;
    if (customSlug) {
      // Check if custom slug already exists
      const slugExists = await Url.findOne({ slug: customSlug });
      if (slugExists) {
        return res.status(409).json({
          success: false,
          message: 'Custom slug already in use. Please choose another one.'
        });
      }
      slug = customSlug;
    } else {
      // Generate a random slug
      slug = generateRandomSlug();
      
      // Ensure slug uniqueness
      let attempts = 0;
      while (attempts < 5) {
        const slugExists = await Url.findOne({ slug });
        if (!slugExists) break;
        
        // Try a different approach with each attempt
        if (attempts === 0) {
          slug = generateRandomSlug(7); // Try longer slug
        } else if (attempts === 1) {
          slug = encodeBase62(nextId++); // Try base62 encoding
        } else {
          slug = `${generateRandomSlug(4)}${Date.now() % 1000}`; // Random + timestamp
        }
        attempts++;
      }
      
      if (attempts >= 5) {
        return res.status(500).json({
          success: false,
          message: 'Unable to generate unique slug. Please try again.'
        });
      }
    }
    
    // Create and save the new URL document
    const newUrl = new Url({
      slug,
      originalUrl: url,
      expiresAt,
      customSlug: !!customSlug
    });
    
    await newUrl.save();
    
    res.status(201).json({
      success: true,
      slug: newUrl.slug,
      originalUrl: newUrl.originalUrl,
      shortUrl: `${req.protocol}://${req.get('host')}/${newUrl.slug}`,
      expiresAt: newUrl.expiresAt
    });
  } catch (error) {
    console.error('Error creating short URL:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while creating short URL'
    });
  }
};

/**
 * Resolve and redirect to the original URL
 * @route GET /:slug
 */
const redirectToUrl = async (req, res) => {
  try {
    const { slug } = req.params;
    
    // Find the URL document by slug
    const url = await Url.findOne({ slug });
    
    // If URL doesn't exist
    if (!url) {
      return res.status(404).render('error', { message: 'URL not found' });
    }
    
    // Check if URL has expired
    const now = new Date();
    if (url.expiresAt && now > url.expiresAt) {
      return res.status(410).render('error', { message: 'Link has expired' });
    }
    
    // Increment click count
    url.clicks += 1;
    await url.save();
    
    // Redirect to the original URL
    res.redirect(url.originalUrl);
  } catch (error) {
    console.error('Error redirecting to URL:', error);
    res.status(500).render('error', { message: 'Server error during redirection' });
  }
};

/**
 * Get statistics about URLs
 * @route GET /api/url/stats
 */
const getUrlStats = async (req, res) => {
  try {
    // Get total count of URLs
    const totalUrls = await Url.countDocuments();
    
    // Get count of active URLs (not expired)
    const now = new Date();
    const activeUrls = await Url.countDocuments({
      $or: [
        { expiresAt: null },
        { expiresAt: { $gt: now } }
      ]
    });
    
    // Get count of expired URLs
    const expiredUrls = await Url.countDocuments({
      expiresAt: { $lte: now, $ne: null }
    });
    
    // Get count of custom slugs
    const customUrls = await Url.countDocuments({ customSlug: true });
    
    // Get top 5 most clicked URLs
    const topUrls = await Url.find({
      $or: [
        { expiresAt: null },
        { expiresAt: { $gt: now } }
      ]
    })
    .sort({ clicks: -1 })
    .limit(5)
    .select('slug originalUrl clicks');
    
    res.status(200).json({
      success: true,
      stats: {
        totalUrls,
        activeUrls,
        expiredUrls,
        customUrls,
        topUrls
      }
    });
  } catch (error) {
    console.error('Error fetching URL stats:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching URL stats'
    });
  }
};

module.exports = {
  createShortUrl,
  redirectToUrl,
  getUrlStats
};
