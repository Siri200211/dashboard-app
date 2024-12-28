import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Navbar.css';
import sltLogo from '../components/slt.png';

const Navbar = () => {
  const location = useLocation();

  // Do not render the navbar if we're on '/homeNew' page
  if (location.pathname === '/') {
    return null; // No navbar on /homeNew
  }

  // Determine the title based on the current route
  let pageTitle = '';
  if (location.pathname === '/all') pageTitle = 'Combined Reports';
  else if (location.pathname === '/peo') pageTitle = 'PEO TV';
  else if (location.pathname === '/fiber') pageTitle = 'ACCESS BAERER';
  else if (location.pathname === '/statistics') pageTitle = 'STATISTICS';
  else if (location.pathname === '/disconnections') pageTitle = 'Disconnections';

  // Render full menu for pages like /, /peo, /import, /all, /fiber, /statistics
  const renderFullMenu = () => (
    <>
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
    </>
  );

  // Render limited menu for /home, /disconnections, and /importdisconn
  const renderHomeAndDisconnectionsMenu = () => (
    <>
      <li className="nav-item">
        <Link to="/disconnections" className="nav-links">DISCONNECTIONS</Link>
      </li>
    </>
  );

  // Always set "HOME" link to redirect to /homeNew
  const homeLink = '/'; // Always redirect to /homeNew when "HOME" is clicked

  return (
    <nav className="navbar">
      <div className="navbar-container">
        {/* Navbar Logo */}
        <div className="navbar-logo">
          <img src={sltLogo} alt="SLT Logo" className="logo" />
          {/* HOME link */}
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

        {/* Conditionally render menu items based on the current route */}
        <ul className="nav-menu">
          {/* Full menu for pages other than /home, /disconnections, and /importdisconn */}
          {location.pathname !== '/home' && location.pathname !== '/disconnections' && location.pathname !== '/importdisconn' ? (
            renderFullMenu()
          ) : (
            // Limited menu for /home, /disconnections, and /importdisconn
            renderHomeAndDisconnectionsMenu()
          )}
        </ul>

        {/* Import New Data Button */}
        {location.pathname === '/homeNew' && (
          <div className="navbar-button">
            <Link to="/import" className="import-button">Import New Data</Link>
          </div>
        )}

        {location.pathname === '/home' && (
          <div className="navbar-button">
            <Link to="/importdisconn" className="import-button">Import New Data</Link>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
