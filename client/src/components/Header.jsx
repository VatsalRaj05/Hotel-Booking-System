import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Header.css';

const Header = () => {
  const navigate = useNavigate();

  const handleLogoClick = () => {
    navigate('/');
  };

  return (
    <header className="header">
      <div className="header-container">
        <div className="header-content">
          <div className="header-logo" onClick={handleLogoClick}>
            <div className="logo-icon">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                  stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <span className="logo-text">HotelHub</span>
          </div>

          <nav className="header-nav">
            <Link to="/" className="nav-link">Home</Link>
            <Link to="/hotels" className="nav-link">Browse Hotels</Link>
            <a href="/health" className="nav-link" target="_blank" rel="noopener noreferrer">
              API Status
            </a>
          </nav>

          <div className="header-actions">
            <button className="btn btn-outline">
              Sign In
            </button>
            <button className="btn btn-primary">
              List Your Property
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;