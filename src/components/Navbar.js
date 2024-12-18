import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Navbar.css';
import sltLogo from '../components/slt.png';

const Navbar = () => {
  const location = useLocation();

  // Determine the title based on the current route
  let pageTitle = '';
  if (location.pathname === '/all') pageTitle = 'Combined Reports';
  else if (location.pathname === '/peo') pageTitle = 'PEO TV';
  else if (location.pathname === '/fiber') pageTitle = 'FIBER';
  else if (location.pathname === '/statistics') pageTitle = 'STATISTICS';

  return (
    <nav className="navbar">
      <div className="navbar-container">
        {/* Navbar Logo */}
        <div className="navbar-logo">
          <img src={sltLogo} alt="SLT Logo" className="logo" />
          <Link to="/" className="navbar-title">HOME</Link>
        </div>

        {/* Dynamic Right-Aligned Title */}
        {pageTitle && (
          <div className="navbar-right">
            <span className="right-title">{pageTitle}</span>
          </div>
        )}

        {/* Navigation Menu */}
        <ul className="nav-menu">
          <li className="nav-item">
            <Link to="/all" className="nav-links">ALL</Link>
          </li>
          <li className="nav-item">
            <Link to="/peo" className="nav-links">PEO TV</Link>
          </li>
          <li className="nav-item">
            <Link to="/fiber" className="nav-links">ACCESS BAERER</Link>
          </li>
          <li className="nav-item">
            <Link to="/statistics" className="nav-links">STATISTICS</Link>
          </li>
        </ul>

        {/* Import New Data Button - Visible Only on Home Page */}
        {location.pathname === '/' && (
          <div className="navbar-button">
            <Link to="/import" className="import-button">Import New Data</Link>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
