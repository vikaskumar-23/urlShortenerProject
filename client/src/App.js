// client/src/App.js
import React, { useState } from 'react';
import './App.css';
import Header from './components/Header';
import Footer from './components/Footer';
import UrlForm from './components/UrlForm';
import Stats from './components/Stats';

function App() {
  const [showStats, setShowStats] = useState(false);

  return (
    <div className="app">
      <Header />
      
      <main className="container">
        <div className="tabs">
          <button 
            className={!showStats ? 'active' : ''} 
            onClick={() => setShowStats(false)}
          >
            Shorten URL
          </button>
          <button 
            className={showStats ? 'active' : ''} 
            onClick={() => setShowStats(true)}
          >
            Statistics
          </button>
        </div>
        
        <div className="content">
          {showStats ? <Stats /> : <UrlForm />}
        </div>
      </main>
      
      <Footer />
    </div>
  );
}

export default App;