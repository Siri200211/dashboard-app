import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Box, Typography, CircularProgress } from '@mui/material'; // Import MUI components
import './HomePage.css'; // Custom styles for the home page
import sltLogo from '../components/slt.png';

const HomePage = () => {
  const [lastUpdated, setLastUpdated] = useState(null); // State for last updated date
  const [loading, setLoading] = useState(true); // State for loading indicator
  const [error, setError] = useState(null); // State for error handling

  // Fetch the last updated date when the component mounts

    const fetchLastUpdatedDate = async () => {
      try {
        const response = await fetch('http://localhost:8070/get-last-updated'); // Correct URL with port 8070
  
        if (!response.ok) {
          // Handle non-200 HTTP responses
          throw new Error(`HTTP error! status: ${response.status}`);
        }
  
        const data = await response.json();
        setLastUpdated(data.lastUpdated); // Set the last updated date in the state
      } catch (error) {
        console.error("Error fetching last updated date:", error);
        setError("There was an issue fetching the last updated date.");
      } finally {
        setLoading(false); // Set loading to false once the fetch is done
      }
    };
useEffect(() => {
    fetchLastUpdatedDate();
  }, []);
  // Empty dependency array means this effect runs only once when the component mounts

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: `url(/BG.jpg) no-repeat center center fixed, linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.7))`,
        backgroundSize: "cover",
        padding: 4,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden", // Prevent scrollbars
        animation: 'fadeIn 1s ease-in-out', // Apply page fade-in animation
      }}
    >
      {/* Banner Section */}
      <div className="home-banner">
        <div className="logo-container">
          <img src={sltLogo} alt="SLT Logo" className="home-logo" />
        </div>
        <Typography
          variant="h3"
          gutterBottom
          sx={{
            textAlign: "center",
            color: "#fff",
            fontWeight: "bold",
            textShadow: "2px 2px 4px rgba(0, 0, 0, 0.7)",
            animation: 'fadeInText 1.5s ease-in-out', // Fade in effect for title
          }}
        >
          PEOTV Sales Reports
        </Typography>
        <Typography
          variant="h6"
          sx={{
            textAlign: "center",
            color: "#d3d3d3",
            textShadow: "1px 1px 4px rgba(0, 0, 0, 0.5)",
            animation: 'fadeInText 1.5s ease-in-out 0.5s', // Fade in effect for subtitle
          }}
        >
          Explore our services and reports
        </Typography>
      </div>

      <Typography
              variant="h6"
              sx={{
                marginTop: 3,
                color: "#fff",
                fontWeight: "bold",
                textShadow: "1px 1px 4px rgba(0, 0, 0, 0.5)",
              }}
            >
              {loading ? (
                <CircularProgress color="inherit" /> // Show loading spinner while fetching data
              ) : error ? (
                <span style={{ color: "red" }}>{error}</span> // Show error message if fetching fails
              ) : (
                `Last Updated: ${new Date(lastUpdated).toLocaleString()}`
              )}
            </Typography>
      

      {/* Navigation Cards Section */}
      <div className="home-cards" style={{ marginTop: '50px' }}>
        <Link to="/all" className="home-card">
          <h2>Combined Reports</h2>
          <p>View all sales data in one place.</p>
        </Link>
        <Link to="/peotv" className="home-card">
          <h2>PEO TV </h2>
          <p>Explore PEO TV reports and data.</p>
        </Link>
        <Link to="/fiber" className="home-card">
          <h2>Access Bearer</h2>
          <p>Access Fiber service reports and statistics.</p>
        </Link>
        <Link to="/statistics" className="home-card">
          <h2>Statistics</h2>
          <p>Dive into detailed statistical insights.</p>
        </Link>
       
      </div>
    </Box>
  );
};

export default HomePage;
