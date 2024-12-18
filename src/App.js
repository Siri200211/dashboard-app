import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Overview from './components/Overview'; // Example component
import FiberStatisticsPage from './components/FiberStatisticsPage';
import 'bootstrap/dist/css/bootstrap.min.css';
import CsvUploadPage from './components/CsvUploadPage'; // Your CsvUploadPage component
import FiberOrders from './components/FiberOrders';
import CombinedReports from './components/CombinedReports';
import Navbar from './components/Navbar';
import HomePage from './components/HomePage';


function App() {
  return (
    <Router>
            <Navbar/>
      <Routes>
        <Route path="/peo" element={<Overview />} />
        <Route path="/import" element={<CsvUploadPage />} />
        <Route path="/fiber" element={<FiberOrders/>} />
        <Route path="/all" element={<CombinedReports/>} />
        <Route path="/" element={<HomePage/>} />
        <Route path="/statistics" element={<FiberStatisticsPage/>} />
      </Routes>
    </Router>
  );
}

export default App;
