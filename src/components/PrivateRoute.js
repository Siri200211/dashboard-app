import React from "react";
import { Navigate } from "react-router-dom";

const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem("token"); // Check for stored token

  return token ? children : <Navigate to="/login" />; // Redirect to login if no token
};

export default PrivateRoute;