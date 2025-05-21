// client/src/components/Stats.js
import React, { useState, useEffect } from 'react';

function Stats() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch('/api/url/stats');
        
        if (!response.ok) {
          throw new Error('Failed to fetch statistics');
        }
        
        const data = await response.json();
        setStats(data.stats);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    
    fetchStats();
  }, []);
  
  if (loading) {
    return <div className="loading">Loading statistics...</div>;
  }
  
  if (error) {
    return <div className="error-message">Error: {error}</div>;
  }
  
  return (
    <div className="stats-container">
      <h2>URL Shortener Statistics</h2>
      
      <div className="stats-grid">
        <div className="stat-card">
          <h3>Total URLs</h3>
          <p className="stat-value">{stats.totalUrls}</p>
        </div>
        
        <div className="stat-card">
          <h3>Active URLs</h3>
          <p className="stat-value">{stats.activeUrls}</p>
        </div>
        
        <div className="stat-card">
          <h3>Expired URLs</h3>
          <p className="stat-value">{stats.expiredUrls}</p>
        </div>
        
        <div className="stat-card">
          <h3>Custom URLs</h3>
          <p className="stat-value">{stats.customUrls}</p>
        </div>
      </div>
      
      {stats.topUrls && stats.topUrls.length > 0 && (
        <div className="top-urls">
          <h3>Top 5 Most Clicked URLs</h3>
          <table>
            <thead>
              <tr>
                <th>Slug</th>
                <th>Original URL</th>
                <th>Clicks</th>
              </tr>
            </thead>
            <tbody>
              {stats.topUrls.map((url) => (
                <tr key={url.slug}>
                  <td>{url.slug}</td>
                  <td className="truncate">{url.originalUrl}</td>
                  <td>{url.clicks}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default Stats;