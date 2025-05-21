// client/src/components/Footer.js
import React from 'react';

function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <p>&copy; {new Date().getFullYear()} URL Shortener - Made By Vikas Kumar.</p>
      </div>
    </footer>
  );
}

export default Footer;