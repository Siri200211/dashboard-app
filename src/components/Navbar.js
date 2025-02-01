import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Navbar.css';
import sltLogo from '../components/slt.png';

const Navbar = () => {
  const location = useLocation();
  const role = localStorage.getItem("role"); // Get the role from localStorage

  // Do not render the navbar on specific routes
  if (location.pathname === '/' || location.pathname === '/login' || location.pathname === '/signup') {
    return null;
  }

  // Determine the title based on the current route
  let pageTitle = '';
  if (location.pathname === '/all') pageTitle = 'Combined Reports';
  else if (location.pathname === '/peo') pageTitle = 'PEO TV';
  else if (location.pathname === '/fiber') pageTitle = 'ACCESS BAERER';
  else if (location.pathname === '/statistics') pageTitle = 'STATISTICS';
  else if (location.pathname === '/combine') pageTitle = 'Disconnections';

  // Render full menu for main report pages
  const renderFullMenu = () => (
    <>
      <li className="nav-item">
        <Link to="/all" className="nav-links">ALL</Link>
      </li>
      <li className="nav-item">
        <Link to="/peo" className="nav-links">PEO TV</Link>
      </li>
      <li className="nav-item">
        <Link to="/fiber" className="nav-links">ACCESS BEARER</Link>
      </li>
      <li className="nav-item">
        <Link to="/statistics" className="nav-links">STATISTICS</Link>
      </li>
    </>
  );

  // Render menu for disconnections and related pages
  const renderHomeAndDisconnectionsMenu = () => (
    <>
      <li className="nav-item">
        <Link to="/combine" className="nav-links">DISCONNECTIONS</Link>
      </li>
    </>
  );

  const homeLink = '/'; // Redirect to home page

  return (
    <nav className="navbar">
      <div className="navbar-container">
        {/* Navbar Logo */}
        <div className="navbar-logo">
          <img src={sltLogo} alt="SLT Logo" className="logo" />
          <Link to={homeLink} className="navbar-title">
            HOME
          </Link>
        </div>

        {/* Dynamic Right-Aligned Title */}
        {pageTitle && (
          <div className="navbar-right">
            <span className="right-title">{pageTitle}</span>
          </div>
        )}

        {/* Navigation Menu */}
        <ul className="nav-menu">
          {location.pathname !== '/home' && location.pathname !== '/combine' && location.pathname !== '/importdisconn' ? (
            renderFullMenu()
          ) : (
            renderHomeAndDisconnectionsMenu()
          )}
        </ul>

        {/* Import CSV File Button - only for admin */}
        {role === 'admin' && location.pathname === '/homeNew' && (
          <div className="navbar-button">
            <Link to="/import" className="import-button">Import New Data</Link>
          </div>
        )}

        {role === 'admin' && location.pathname === '/home' && (
          <div className="navbar-button">
            <Link to="/importdisconn" className="import-button">Import New Data</Link>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;