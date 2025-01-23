import React, { useState } from "react";
import axios from "axios";
import { Box, TextField, Button, Typography, Alert } from "@mui/material";
import { useNavigate } from "react-router-dom";

const SignUp = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("user"); // Default role as "user"
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate(); // Navigate function for redirection

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      const res = await axios.post("http://localhost:8070/api/auth/register", {
        username,
        password,
        role,
      });
      setSuccess("User registered successfully!");
      setTimeout(() => {
        navigate("/"); // Redirect to HomePageNew after 2 seconds
      }, 2000);
      setUsername("");
      setPassword("");
      setRole("user");
    } catch (err) {
      setError("Error registering user. Please try again.");
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: `url(/BG.jpg) no-repeat center center fixed`,
        backgroundSize: "cover",
        "&::before": {
          content: '""',
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          background: "rgba(0, 0, 0, 0.6)", // Overlay to darken background image
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
          boxShadow: "0 8px 24px rgba(0, 0, 0, 0.4)",
          background: "linear-gradient(135deg, #1f1f2b, #2d2f52)",
          color: "#fff",
        }}
      >
        <Typography variant="h4" textAlign="center" fontWeight="bold" sx={{ mb: 3 }}>
          Create New User
        </Typography>
        {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Username"
            variant="filled"
            margin="normal"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            sx={{
              backgroundColor: "rgba(255, 255, 255, 0.1)",
              color: "#fff",
              borderRadius: 1,
              "& input": { color: "#fff" },
            }}
          />
          <TextField
            fullWidth
            label="Password"
            type="password"
            variant="filled"
            margin="normal"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            sx={{
              backgroundColor: "rgba(255, 255, 255, 0.1)",
              color: "#fff",
              borderRadius: 1,
              "& input": { color: "#fff" },
            }}
          />
          <TextField
            fullWidth
            label="Role (user/admin)"
            variant="filled"
            margin="normal"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            sx={{
              backgroundColor: "rgba(255, 255, 255, 0.1)",
              color: "#fff",
              borderRadius: 1,
              "& input": { color: "#fff" },
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
                boxShadow: "0 4px 12px rgba(0, 0, 0, 0.2)",
              },
            }}
          >
            Register
          </Button>
        </form>
      </Box>
    </Box>
  );
};

export default SignUp;