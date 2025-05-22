import React from 'react';

function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <p>&copy; {new Date().getFullYear()} URL Shortener - Made By <a href="https://www.linkedin.com/in/vikaskumar20/" target="_blank" rel="noopener noreferrer">Vikas Kumar</a>.</p>
      </div>
    </footer>
  );
}

export default Footer;
