import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Box, Typography, CircularProgress } from '@mui/material'; // MUI components for styling
import './HomePage2.css'; // Custom CSS
import sltLogo from '../components/slt.png'; // Logo import

const HomePage2 = () => {
  const [lastUpdated, setLastUpdated] = useState(null); // State to store the last updated date
  const [loading, setLoading] = useState(true); // Loading state for fetching data
  const [error, setError] = useState(null); // Error state for handling errors

  // Function to fetch the last updated date from the backend
  const fetchLastUpdatedDate = async () => {
    try {
      const response = await fetch('http://localhost:8070/get-last-update'); // Correct URL with port 8070

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

  // Use useEffect hook to fetch the data when the component mounts
  useEffect(() => {
    fetchLastUpdatedDate();
  }, []);

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
        color: '#fff',
        textAlign: 'center',
        animation: 'fadeIn 1s ease-in-out', // Fade-in effect for the whole page
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
            animation: 'fadeInText 1.5s ease-in-out', // Fade-in animation for the title
          }}
        >
          PEOTV Disconnection Reports
        </Typography>
        <Typography
          variant="h6"
          sx={{
            textAlign: "center",
            color: "#d3d3d3",
            textShadow: "1px 1px 4px rgba(0, 0, 0, 0.5)",
            animation: 'fadeInText 1.5s ease-in-out 0.5s', // Subtitle fade-in with delay
          }}
        >
          Explore our services and reports
        </Typography>
      </div>

      {/* Last Updated Date Section */}
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
      <div className="home-cards" style={{ marginTop: '30px' }}>
        <Link to="/combine" className="home-card">
          <h2>Disconnection Report</h2>
          <p>Explore disconnection data in one place.</p>
        </Link>
        <Link to="#" className="home-card">
          <h2>Statistics</h2>
          <p>Dive into detailed statistical insights.</p>
        </Link>
        <Link to="#" className="home-card">
          <h2>Combined Report</h2>
          <p>Explore disconnection data in one place.</p>
        </Link>
      </div>
    </Box>
  );
};

export default HomePage2;
