import React, { useState } from 'react';

function UrlForm() {
  const [formData, setFormData] = useState({
    url: '',
    customSlug: '',
    expiryDays: ''
  });
  const [customExpiry, setCustomExpiry] = useState('');
  const [showCustomExpiry, setShowCustomExpiry] = useState(false);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'expiryDays') {
      setShowCustomExpiry(value === 'custom');
      setFormData({
        ...formData,
        [name]: value === 'custom' ? '' : value
      });
      if (value !== 'custom') setCustomExpiry('');
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };

  const handleCustomExpiryChange = (e) => {
    setCustomExpiry(e.target.value);
    setFormData({
      ...formData,
      expiryDays: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setCopied(false);
    try {
      const response = await fetch('/api/url/shorten', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Failed to shorten URL');
      }
      setResult(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    if (result && result.shortUrl) {
      navigator.clipboard.writeText(result.shortUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    }
  };

  const resetForm = () => {
    setFormData({
      url: '',
      customSlug: '',
      expiryDays: ''
    });
    setCustomExpiry('');
    setShowCustomExpiry(false);
    setResult(null);
    setError(null);
    setCopied(false);
  };

  return (
    <div className="url-form-container">
      {!result ? (
        <form onSubmit={handleSubmit} className="url-form">
          <div className="form-group">
            <label htmlFor="url">URL to Shorten</label>
            <input
              type="url"
              id="url"
              name="url"
              value={formData.url}
              onChange={handleChange}
              placeholder="https://example.com/very/long/url/that/needs/shortening"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="customSlug">Custom Slug (Optional)</label>
            <input
              type="text"
              id="customSlug"
              name="customSlug"
              value={formData.customSlug}
              onChange={handleChange}
              placeholder="my-custom-link"
            />
            <small>Only letters, numbers, hyphens and underscores (3-20 characters)</small>
          </div>
          <div className="form-group">
            <label htmlFor="expiryDays">Expiry (Optional)</label>
            <select
              id="expiryDays"
              name="expiryDays"
              value={showCustomExpiry ? 'custom' : formData.expiryDays}
              onChange={handleChange}
            >
              <option value="">Never expire</option>
              <option value="1">1 day</option>
              <option value="7">7 days</option>
              <option value="30">30 days</option>
              <option value="90">90 days</option>
              <option value="365">1 year</option>
              <option value="custom">Custom...</option>
            </select>
            {showCustomExpiry && (
              <input
                type="number"
                min="1"
                max="3650"
                className="custom-expiry-input"
                placeholder="Enter days (e.g. 45)"
                value={customExpiry}
                onChange={handleCustomExpiryChange}
                style={{marginTop: '10px'}}
              />
            )}
          </div>
          <button type="submit" className="submit-btn" disabled={loading}>
            {loading ? 'Processing...' : 'Shorten URL'}
          </button>
          {error && <div className="error-message">{error}</div>}
        </form>
      ) : (
        <div className="result-container">
          <h3>URL Shortened Successfully!</h3>
          <div className="result-details">
            <div className="result-item">
              <label>Original URL:</label>
              <p className="truncate">{result.originalUrl}</p>
            </div>
            <div className="result-item">
              <label>Short URL:</label>
              <div className="short-url-display">
                <p>{result.shortUrl}</p>
                <button onClick={copyToClipboard} className={`copy-btn${copied ? ' copied' : ''}`}>{copied ? 'Copied!' : 'Copy'}</button>
              </div>
            </div>
            {result.expiresAt && (
              <div className="result-item">
                <label>Expires At:</label>
                <p>{new Date(result.expiresAt).toLocaleString()}</p>
              </div>
            )}
          </div>
          <button onClick={resetForm} className="reset-btn">Shorten Another URL</button>
        </div>
      )}
    </div>
  );
}

export default UrlForm;
