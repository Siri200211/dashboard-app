import React from "react";
import { Navigate } from "react-router-dom";

const PrivateAdminRoute = ({ children }) => {
  const token = localStorage.getItem("token"); // Check for token
  const role = localStorage.getItem("role"); // Check for role

  return token && role === "admin" ? children : <Navigate to="/login" />; // Redirect if not admin
};

export default PrivateAdminRoute;