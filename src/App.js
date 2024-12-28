import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Overview from './components/Overview';
import FiberStatisticsPage from './components/FiberStatisticsPage';
import 'bootstrap/dist/css/bootstrap.min.css';
import CsvUploadPage from './components/CsvUploadPage';
import FiberOrders from './components/FiberOrders';
import CombinedReports from './components/CombinedReports';
import Navbar from './components/Navbar';
import HomePage from './components/HomePage';
import PeoTvCounts from './components/peoTvCounts';
import HomePage2 from './components/HomePage2';
import DisconnectionCsvUpload from './components/DisconnectionCsvUpload';
import HomePageNew from './components/HomePageNew';

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/peo" element={<Overview />} />
        <Route path="/import" element={<CsvUploadPage />} />
        <Route path="/fiber" element={<FiberOrders />} />
        <Route path="/all" element={<CombinedReports />} />
        <Route path ="/home" element={<HomePage2/>} />
        <Route path="/homeNew" element={<HomePage/>} />
        <Route path="/" element={<HomePageNew/>} /> 
        <Route path="/statistics" element={<FiberStatisticsPage />} />
        <Route path="/disconnections" element={<PeoTvCounts />} /> {/* New route */}
        <Route path='/importdisconn' element={<DisconnectionCsvUpload/>} />
      </Routes>
    </Router>
  );
}

export default App;
