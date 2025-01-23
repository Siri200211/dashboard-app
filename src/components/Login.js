import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  Box,
  TextField,
  Button,
  Typography,
  Alert,
  InputAdornment,
  IconButton,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
  
    try {
      const res = await axios.post("http://localhost:8070/api/auth/login", {
        username,
        password,
      });
  
      localStorage.setItem("token", res.data.token); // Save token
      localStorage.setItem("role", res.data.role); // Save role (e.g., admin or user)
      localStorage.setItem("username", username); // Save the username
      alert(`Welcome, ${username}!`);
      navigate("/"); // Redirect to home page
    } catch (err) {
      setError("Invalid username or password. Please try again.");
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const handleSignUpRedirect = () => {
    navigate("/signup"); // Redirect to sign-up page
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: `url(/BG.JPG) no-repeat center center fixed`,
        backgroundSize: "cover",
        "&::before": {
          content: '""',
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          background: "rgba(0, 0, 0, 0.7)", // Dark overlay
          zIndex: -1,
        },
      }}
    >
      <Box
        sx={{
          width: "100%",
          maxWidth: 500,
          padding: 4,
          borderRadius: 3,
          boxShadow: "0 8px 24px rgba(0, 0, 0, 0.3)",
          background: "linear-gradient(135deg, #1a1f38, #2d2f52)",
          color: "#fff",
        }}
      >
        <Typography
          variant="h4"
          textAlign="center"
          fontWeight="bold"
          sx={{ color: "#f0f0f0", mb: 2 }}
        >
          Welcome Back!
        </Typography>
        <Typography
          variant="subtitle1"
          textAlign="center"
          sx={{ color: "#b0b0b0", mb: 3 }}
        >
          Log in to access your dashboard.
        </Typography>
        {error && <Alert severity="error">{error}</Alert>}
        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Username"
            variant="filled"
            margin="normal"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            InputProps={{
              sx: {
                backgroundColor: "rgba(255, 255, 255, 0.1)",
                color: "#fff",
                borderRadius: 1,
                "& input": { color: "#fff" },
              },
            }}
          />
          <TextField
            fullWidth
            label="Password"
            variant="filled"
            type={showPassword ? "text" : "password"}
            margin="normal"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            InputProps={{
              sx: {
                backgroundColor: "rgba(255, 255, 255, 0.1)",
                color: "#fff",
                borderRadius: 1,
                "& input": { color: "#fff" },
              },
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={togglePasswordVisibility}>
                    {showPassword ? (
                      <VisibilityOff sx={{ color: "#fff" }} />
                    ) : (
                      <Visibility sx={{ color: "#fff" }} />
                    )}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          <Button
            fullWidth
            type="submit"
            variant="contained"
            sx={{
              mt: 3,
              py: 1.5,
              fontWeight: "bold",
              background: "linear-gradient(135deg, #4f3cc9, #1b1f44)",
              "&:hover": {
                background: "linear-gradient(135deg, #2b2575, #1b1f44)",
              },
            }}
          >
            Login
          </Button>
        </form>
        <Typography
          textAlign="center"
          sx={{ color: "#fff", mt: 3, fontSize: "0.9rem" }}
        >
          Don’t have an account?{" "}
          <span
            style={{ color: "#ff9e57", cursor: "pointer", fontWeight: "bold" }}
            onClick={handleSignUpRedirect}
          >
            Sign Up
          </span>
        </Typography>
      </Box>
    </Box>
  );
};

export default Login;