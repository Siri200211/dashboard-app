import React from 'react';
import { Link } from 'react-router-dom';
import { Box, Typography, Grid, Card, CardContent, CardActionArea } from '@mui/material';
import { FaFacebook, FaTwitter, FaLinkedin, FaInstagram } from 'react-icons/fa';
import './HomePageNew.css'; // Import custom styles
import sltLogo from '../components/slt.png';

const HomePageNew = () => {
  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: `url(/BG.jpg) no-repeat center center fixed, linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.8))`,
        backgroundSize: 'cover',
        padding: 4,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#fff',
        textAlign: 'center',
        overflow: 'hidden',
        animation: 'fadeIn 2s ease-in-out', // Added fade-in effect to the page
      }}
    >
      {/* Hero Section */}
      <div className="home-banner zoom-in" style={{ animation: 'zoomIn 1s ease' }}>
        <img
          src={sltLogo}
          alt="SLT Logo"
          className="home-logo"
          style={{
            maxWidth: '250px',
            borderRadius: '12px',
            animation: 'bounce 1.5s ease-in-out infinite',
          }}
        />
        <Typography
          variant="h2"
          sx={{
            fontWeight: 'bold',
            letterSpacing: '1px',
            fontFamily: 'Poppins, sans-serif',
            textShadow: '2px 2px 10px rgba(0, 0, 0, 0.8)',
            marginTop: '20px',
            animation: 'fadeInText 2s ease-in-out',
          }}
        >
          Welcome to PEOTV Reports
        </Typography>
        <Typography
          variant="h5"
          sx={{
            color: '#d3d3d3',
            marginTop: '15px',
            fontWeight: '400',
            textShadow: '1px 1px 5px rgba(0, 0, 0, 0.5)',
            fontFamily: 'Roboto, sans-serif',
            animation: 'fadeInText 2s ease-in-out 1s',
          }}
        >
          Discover insights with real-time data analysis and reports
        </Typography>
      </div>

      {/* Navigation Cards Section */}
      <Grid container spacing={4} justifyContent="center" sx={{ marginTop: '30px' }}>
        {/* Card 1 - New Connection Reports */}
        <Grid item xs={12} sm={6} md={4}>
          <Link to="homeNew" style={{ textDecoration: 'none' }}>
            <Card
              sx={{
                background: 'linear-gradient(45deg, #3c8dbc, #007bff)', // Gradient blue (Professional look)
                borderRadius: 3,
                boxShadow: 6,
                transition: 'transform 0.3s ease, box-shadow 0.3s ease, background-color 0.3s ease',
                '&:hover': {
                  transform: 'scale(1.05)',
                  boxShadow: '0 15px 40px rgba(0, 0, 0, 0.3)',
                  background: 'linear-gradient(45deg, #007bff, #3c8dbc)', // Reverse gradient on hover
                  animation: 'hoverEffect 0.3s ease-in-out', // Hover animation for the card
                },
              }}
            >
              <CardActionArea>
                <CardContent sx={{ padding: 3 }}>
                  <Typography
                    variant="h5"
                    sx={{ fontWeight: 'bold', color: '#fff', marginBottom: 2 }}
                  >
                    New Connection Reports
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#bdc3c7' }}>
                    Dive deep into real-time connection reports and insights for better decision-making.
                  </Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          </Link>
        </Grid>

        {/* Card 2 - Disconnection Reports */}
        <Grid item xs={12} sm={6} md={4}>
          <Link to="/home" style={{ textDecoration: 'none' }}>
            <Card
              sx={{
                background: 'linear-gradient(45deg, #8e8e8e, #4f4f4f)', // Sleek grey gradient (Professional)
                borderRadius: 3,
                boxShadow: 6,
                transition: 'transform 0.3s ease, box-shadow 0.3s ease, background-color 0.3s ease',
                '&:hover': {
                  transform: 'scale(1.05)',
                  boxShadow: '0 15px 40px rgba(0, 0, 0, 0.3)',
                  background: 'linear-gradient(45deg, #4f4f4f, #8e8e8e)', // Reverse gradient on hover
                  animation: 'hoverEffect 0.3s ease-in-out', // Hover animation for the card
                },
              }}
            >
              <CardActionArea>
                <CardContent sx={{ padding: 3 }}>
                  <Typography
                    variant="h5"
                    sx={{ fontWeight: 'bold', color: '#fff', marginBottom: 2 }}
                  >
                    Disconnection Reports
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#bdc3c7' }}>
                    Analyze disconnection trends and gain actionable insights to optimize your services.
                  </Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          </Link>
        </Grid>
      </Grid>

      {/* Footer Section */}
      <footer
        style={{
          marginTop: '50px',
          padding: '20px',
          backgroundColor: '#34495e',
          width: '100%',
          color: '#fff',
          textAlign: 'center',
          position: 'relative',
          bottom: 0,
        }}
      >
        <Typography variant="body2" sx={{ marginBottom: 2 }}>
          &copy; 2024 PEOTV Reports. All rights reserved.
        </Typography>
        <div>
          <Link
            to="https://www.facebook.com"
            target="_blank"
            style={{
              margin: '0 10px',
              transition: 'transform 0.3s ease',
            }}
            className="social-icon"
          >
            <FaFacebook size={24} color="#fff" />
          </Link>
          <Link
            to="https://twitter.com"
            target="_blank"
            style={{
              margin: '0 10px',
              transition: 'transform 0.3s ease',
            }}
            className="social-icon"
          >
            <FaTwitter size={24} color="#fff" />
          </Link>
          <Link
            to="https://www.linkedin.com"
            target="_blank"
            style={{
              margin: '0 10px',
              transition: 'transform 0.3s ease',
            }}
            className="social-icon"
          >
            <FaLinkedin size={24} color="#fff" />
          </Link>
          <Link
            to="https://www.instagram.com"
            target="_blank"
            style={{
              margin: '0 10px',
              transition: 'transform 0.3s ease',
            }}
            className="social-icon"
          >
            <FaInstagram size={24} color="#fff" />
          </Link>
        </div>
      </footer>
    </Box>
  );
};

export default HomePageNew;