import React from 'react';
import { Link } from 'react-router-dom';
import './HomePage.css'; // Custom styles for the home page
import sltLogo from '../components/slt.png';

const HomePage = () => {
  return (
    <div className="home-container">
      {/* Background Section */}
      <div className="home-banner">
        <div className="logo-container">
          <img src={sltLogo} alt="SLT Logo" className="home-logo" />
        </div>
        <h1 className="home-title">PEOTV Sales Reports</h1>
        <p className="home-subtitle">Explore our services and reports</p>
      </div>

      {/* Navigation Cards Section */}
      <div className="home-cards">
        <Link to="/all" className="home-card">
          <h2>Combined Reports</h2>
          <p>View all sales data in one place.</p>
        </Link>
        <Link to="/peo" className="home-card">
          <h2>PEO TV</h2>
          <p>Explore PEO TV reports and data.</p>
        </Link>
        <Link to="/fiber" className="home-card">
          <h2>Fiber</h2>
          <p>Access Fiber service reports and statistics.</p>
        </Link>
        <Link to="/statistics" className="home-card">
          <h2>Statistics</h2>
          <p>Dive into detailed statistical insights.</p>
        </Link>
      </div>
    </div>
  );
};

export default HomePage;
