const express = require('express');
const router = express.Router();
const { createShortUrl, getUrlStats } = require('../controllers/urlController');
const { validateUrlRequest } = require('../middleware/validateUrl');

// Create a shortened URL
router.post('/shorten', validateUrlRequest, createShortUrl);

// Get URL statistics
router.get('/stats', getUrlStats);

module.exports = router;
