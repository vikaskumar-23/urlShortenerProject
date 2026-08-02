const mongoose = require('mongoose');

const urlSchema = new mongoose.Schema({
  slug: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  originalUrl: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  expiresAt: {
    type: Date,
    default: null, // null means no expiration
  },
  clicks: {
    type: Number,
    default: 0,
  },
  customSlug: {
    type: Boolean,
    default: false,
  }
});

// Add an index on the slug field for faster lookups
urlSchema.index({ slug: 1 });

// TTL index: MongoDB automatically deletes a document once its expiresAt
// timestamp has passed. Documents where expiresAt is null (never expires)
// are left alone, since the TTL monitor only acts on real Date values.
urlSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

module.exports = mongoose.model('Url', urlSchema);
