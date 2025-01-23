import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import Overview from "./components/Overview";
import CsvUploadPage from "./components/CsvUploadPage";
import FiberOrders from "./components/FiberOrders";
import CombinedReports from "./components/CombinedReports";
import Navbar from "./components/Navbar";
import HomePage from "./components/HomePage";
import HomePage2 from "./components/HomePage2";
import HomePageNew from "./components/HomePageNew";
import DisconnectionCsvUpload from "./components/DisconnectionCsvUpload";
import FiberStatisticsPage from "./components/FiberStatisticsPage";
import Login from "./components/Login";
import Dis from "./components/PeoTvDisconnectionChart";
import Combine from "./components/UnifiedPeoTvDashboard";
import SignUp from "./components/SignUp";
import PrivateAdminRoute from "./components/PrivateAdminRoute";

function PrivateRoute({ children }) {
  const isLoggedIn = !!localStorage.getItem("token"); // Check if token exists
  return isLoggedIn ? children : <Navigate to="/login" />;
}

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("token"));

  useEffect(() => {
    const handleStorageChange = () => {
      setIsLoggedIn(!!localStorage.getItem("token"));
    };

    const handleTabClose = () => {
      localStorage.removeItem("token"); // Remove token on tab close
    };

    window.addEventListener("storage", handleStorageChange);
    window.addEventListener("beforeunload", handleTabClose);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("beforeunload", handleTabClose);
    };
  }, []);

  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    setIsLoggedIn(false);
  };

  return (
    <Router>
      <Navbar />
      <Routes>
        <Route
          path="/"
          element={<HomePageNew isLoggedIn={isLoggedIn} onLogout={handleLogout} />}
        />
        <Route
          path="/homeNew"
          element={
            <PrivateRoute>
              <HomePage />
            </PrivateRoute>
          }
        />
        <Route
          path="/login"
          element={isLoggedIn ? <Navigate to="/" /> : <Login onLogin={handleLogin} />}
        />
        <Route
          path="/signup"
          element={
            <PrivateAdminRoute>
              <SignUp />
            </PrivateAdminRoute>
          }
        />
        <Route
          path="/peo"
          element={
            <PrivateRoute>
              <Overview />
            </PrivateRoute>
          }
        />
        <Route
          path="/import"
          element={
            <PrivateRoute>
              <CsvUploadPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/fiber"
          element={
            <PrivateRoute>
              <FiberOrders />
            </PrivateRoute>
          }
        />
        <Route
          path="/all"
          element={
            <PrivateRoute>
              <CombinedReports />
            </PrivateRoute>
          }
        />
        <Route
          path="/home"
          element={
            <PrivateRoute>
              <HomePage2 />
            </PrivateRoute>
          }
        />
        <Route
          path="/importdisconn"
          element={
            <PrivateRoute>
              <DisconnectionCsvUpload />
            </PrivateRoute>
          }
        />
        <Route
          path="/dischart"
          element={
            <PrivateRoute>
              <Dis />
            </PrivateRoute>
          }
        />
        <Route
          path="/combine"
          element={
            <PrivateRoute>
              <Combine />
            </PrivateRoute>
          }
        />
        <Route
          path="/statistics"
          element={
            <PrivateRoute>
              <FiberStatisticsPage />
            </PrivateRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;