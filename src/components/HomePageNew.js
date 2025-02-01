import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActionArea,
  Button,
} from "@mui/material";
import { FaFacebook, FaTwitter, FaLinkedin, FaInstagram } from "react-icons/fa";
import sltLogo from "../components/slt.png";

const HomePageNew = () => {
  const navigate = useNavigate();
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [role, setRole] = useState(localStorage.getItem("role")); // State for role

  // Sync token and role with `localStorage` when the component mounts or updates
  useEffect(() => {
    const handleStorageChange = () => {
      setToken(localStorage.getItem("token"));
      setRole(localStorage.getItem("role"));
    };

    window.addEventListener("storage", handleStorageChange); // Update state on localStorage change

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token"); // Remove token
    localStorage.removeItem("role"); // Remove role
    setToken(null);
    setRole(null);
    alert("You have been logged out!");
    navigate("/login"); // Redirect to login page
  };

  const handleLogin = () => {
    navigate("/login"); // Navigate to login page
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: `url(/BG.jpg) no-repeat center center fixed, linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.8))`,
        backgroundSize: "cover",
        padding: 4,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        color: "#fff",
        textAlign: "center",
        overflow: "hidden",
        animation: "fadeIn 2s ease-in-out",
      }}
    >
      {/* Hero Section */}
      <div className="home-banner zoom-in" style={{ animation: "zoomIn 1s ease" }}>
        <img
          src={sltLogo}
          alt="SLT Logo"
          className="home-logo"
          style={{
            maxWidth: "250px",
            borderRadius: "12px",
            animation: "bounce 1.5s ease-in-out infinite",
          }}
        />
        <Typography
          variant="h2"
          sx={{
            fontWeight: "bold",
            letterSpacing: "1px",
            fontFamily: "Poppins, sans-serif",
            textShadow: "2px 2px 10px rgba(0, 0, 0, 0.8)",
            marginTop: "20px",
            animation: "fadeInText 2s ease-in-out",
          }}
        >
          Welcome to PEOTV Reports
        </Typography>
        <Typography
          variant="h5"
          sx={{
            color: "#d3d3d3",
            marginTop: "15px",
            fontWeight: "400",
            textShadow: "1px 1px 5px rgba(0, 0, 0, 0.5)",
            fontFamily: "Roboto, sans-serif",
            animation: "fadeInText 2s ease-in-out 1s",
          }}
        >
          Discover insights with real-time data analysis and reports
        </Typography>
      </div>

      {/* Show Login/Logout Button */}
      <Box sx={{ marginTop: 3 }}>
        {!token ? (
          <Button
            variant="contained"
            color="primary"
            onClick={handleLogin}
            sx={{ fontWeight: "bold", mb: 4 }}
          >
            Login
          </Button>
        ) : (
          <Button
            variant="outlined"
            color="secondary"
            onClick={handleLogout}
            sx={{ fontWeight: "bold", mb: 4 }}
          >
            Logout
          </Button>
        )}
      </Box>

      {/* Show Add New User Button for Admins */}
      {token && role === "admin" && (
        <Box sx={{ mb: 4 }}>
          <Button
            component={Link}
            to="/signup"
            sx={{
              color: "#fff",
              background: "linear-gradient(135deg, #6b5bff, #3b8dff)",
              fontWeight: "bold",
              "&:hover": {
                background: "linear-gradient(135deg, #3b8dff, #6b5bff)",
                boxShadow: "0 4px 12px rgba(0, 0, 0, 0.2)",
              },
            }}
          >
            Add New User
          </Button>
        </Box>
      )}

      {/* Navigation Cards Section */}
      <Grid container spacing={4} justifyContent="center">
        <Grid item xs={12} sm={6} md={4}>
          <Link to="/homeNew" style={{ textDecoration: "none" }}>
            <Card
              sx={{
                background: "linear-gradient(45deg, #3c8dbc, #007bff)",
                borderRadius: 3,
                boxShadow: 6,
                transition: "transform 0.3s ease, box-shadow 0.3s ease",
                "&:hover": {
                  transform: "scale(1.05)",
                  boxShadow: "0 15px 40px rgba(0, 0, 0, 0.3)",
                  background: "linear-gradient(45deg, #007bff, #3c8dbc)",
                },
              }}
            >
              <CardActionArea>
                <CardContent sx={{ padding: 3 }}>
                  <Typography
                    variant="h5"
                    sx={{ fontWeight: "bold", color: "#fff", marginBottom: 2 }}
                  >
                    New Connection Reports
                  </Typography>
                  <Typography variant="body2" sx={{ color: "#bdc3c7" }}>
                    Dive deep into real-time connection reports and insights for
                    better decision-making.
                  </Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          </Link>
        </Grid>

        <Grid item xs={12} sm={6} md={4}>
          <Link to="/home" style={{ textDecoration: "none" }}>
            <Card
              sx={{
                background: "linear-gradient(45deg, #8e8e8e, #4f4f4f)",
                borderRadius: 3,
                boxShadow: 6,
                transition: "transform 0.3s ease, box-shadow 0.3s ease",
                "&:hover": {
                  transform: "scale(1.05)",
                  boxShadow: "0 15px 40px rgba(0, 0, 0, 0.3)",
                  background: "linear-gradient(45deg, #4f4f4f, #8e8e8e)",
                },
              }}
            >
              <CardActionArea>
                <CardContent sx={{ padding: 3 }}>
                  <Typography
                    variant="h5"
                    sx={{ fontWeight: "bold", color: "#fff", marginBottom: 2 }}
                  >
                    Disconnection Reports
                  </Typography>
                  <Typography variant="body2" sx={{ color: "#bdc3c7" }}>
                    Analyze disconnection trends and gain actionable insights to
                    optimize your services.
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
          marginTop: "50px",
          padding: "20px",
          backgroundColor: "#34495e",
          width: "100%",
          color: "#fff",
          textAlign: "center",
        }}
      >
        <Typography variant="body2" sx={{ marginBottom: 2 }}>
          &copy; 2024 PEOTV Reports. All rights reserved.
          &copy;Sirimanne
        </Typography>
        <div>
          <a
            href="https://www.facebook.com"
            target="_blank"
            rel="noopener noreferrer"
            style={{ margin: "0 10px" }}
          >
            <FaFacebook size={24} color="#fff" />
          </a>
          <a
            href="https://twitter.com"
            target="_blank"
            rel="noopener noreferrer"
            style={{ margin: "0 10px" }}
          >
            <FaTwitter size={24} color="#fff" />
          </a>
          <a
            href="https://www.linkedin.com"
            target="_blank"
            rel="noopener noreferrer"
            style={{ margin: "0 10px" }}
          >
            <FaLinkedin size={24} color="#fff" />
          </a>
          <a
            href="https://www.instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            style={{ margin: "0 10px" }}
          >
            <FaInstagram size={24} color="#fff" />
          </a>
        </div>
      </footer>
    </Box>
  );
};

export default HomePageNew;