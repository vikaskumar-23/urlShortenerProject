require('dotenv').config();

const express = require('express');
const path = require('path');
const cors = require('cors');
const connectDB = require('./config/db');
const { errorHandler } = require('./middleware/errorHandler');
const { redirectToUrl } = require('./controllers/urlController');

// Initialize Express app
const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());

// Set up static folder for error pages
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Routes
app.use('/api/url', require('./routes/urlRoutes'));

// Serve static assets in production. This must be registered BEFORE the
// "/:slug" redirect route below, otherwise requests for real files like
// favicon.ico or manifest.json get matched as slugs first and 404.
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/build')));
}

// Redirect route (this handles the short URL redirects)
app.get('/:slug', redirectToUrl);

// SPA fallback in production, for any path that isn't a static file,
// an API route, or a known slug
if (process.env.NODE_ENV === 'production') {
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../client/build', 'index.html'));
  });
}

// Error handling middleware
app.use(errorHandler);

// Create a basic error view
app.get('/views/error', (req, res) => {
  res.send(`
    <html>
      <head><title>Error</title></head>
      <body>
        <h1>Error</h1>
        <p>${req.query.message || 'An error occurred'}</p>
        <a href="/">Go Back Home</a>
      </body>
    </html>
  `);
});

// Set port and start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
  console.log(`Error: ${err.message}`);
  // Close server & exit process
  process.exit(1);
});
