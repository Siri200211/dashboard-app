import React, { useEffect, useState } from "react";
import {
  Card,
  Grid,
  Typography,
  Box,
  LinearProgress,
  Container,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Button,
} from "@mui/material";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { getCounts } from "../services/api";

const FiberOrders = () => {
  const [counts, setCounts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [selectedYear, setSelectedYear] = useState("all");
  const [selectedMonth, setSelectedMonth] = useState("all");
  const [selectedDay, setSelectedDay] = useState("all");
  const [filteredCounts, setFilteredCounts] = useState([]);

  useEffect(() => {
    const fetchCounts = async () => {
      try {
        setLoading(true);
        const data = await getCounts();
        const formattedData = data.map((item) => ({
          category: item._id.category,
          orderType: item._id.oss_service_order_type,
          count: item.count,
          year: item._id.year,
          month: item._id.month,
          day: item._id.day,
          serviceType: item._id.order_line_oss_service_type,
        }));
        setCounts(formattedData);
        setFilteredCounts(formattedData); // Initially, display all data
      } catch (error) {
        console.error("Error loading data", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCounts();
  }, []);

  const applyFilters = () => {
    let filtered = counts;

    if (selectedYear !== "all") {
      filtered = filtered.filter((item) => item.year === parseInt(selectedYear));
    }
    if (selectedMonth !== "all") {
      filtered = filtered.filter((item) => item.month === parseInt(selectedMonth));
    }
    if (selectedDay !== "all") {
      filtered = filtered.filter((item) => item.day === parseInt(selectedDay));
    }

    setFilteredCounts(filtered); // Update filtered counts
  };

  if (loading) {
    return (
      <Box sx={{ minHeight: "100vh", background: "linear-gradient(to right, #141E30, #243B55)", padding: 3 }}>
        <LinearProgress color="primary" />
      </Box>
    );
  }

  const aggregatedCounts = {
    "Fiber - NEW ACCESS BAERER": 0,
    "Fiber - NEW ON MIGRATION": 0,
    "Fiber - RECON": 0,
    "Copper - NEW": 0,
    "Copper - RECON": 0,
  };

  filteredCounts.forEach((item) => {
    const combinedKey = `${item.category} - ${item.serviceType} - ${item.orderType}`;
    switch (combinedKey) {
      case "FTTH_NEW_132K - AB-FTTH - CREATE":
        aggregatedCounts["Fiber - NEW ACCESS BAERER"] += item.count;
        break;
      case "FTTH_NEW_132K - AB-FTTH - CREATE-UPGRD SAME NO":
        aggregatedCounts["Fiber - NEW ON MIGRATION"] += item.count;
        break;
      case "FTTH_REC_31K - AB-FTTH - CREATE-RECON":
        aggregatedCounts["Fiber - RECON"] += item.count;
        break;
      case "Other - AB-CAB - CREATE":
        aggregatedCounts["Copper - NEW"] += item.count;
        break;
      case "Other - AB-CAB - CREATE-RECON":
        aggregatedCounts["Copper - RECON"] += item.count;
        break;
      default:
        break;
    }
  });

  const pieDataFiber = Object.keys(aggregatedCounts)
    .filter((key) => key.includes("Fiber"))
    .map((key) => ({
      name: key,
      value: aggregatedCounts[key],
    }));

  const pieDataCopper = Object.keys(aggregatedCounts)
    .filter((key) => key.includes("Copper"))
    .map((key) => ({
      name: key,
      value: aggregatedCounts[key],
    }));

  const years = [2023, 2024]; // Example years
  const months = [
    "January", "February", "March", "April", "May",
    "June", "July", "August", "September", "October",
    "November", "December"
  ];
  const days = Array.from({ length: 31 }, (_, i) => i + 1); // Days 1-31

  const COLORS = [
    "#FFBB28", "#FF8042", "#00C49F", "#0088FE",
    "#FF00FF", "#FF3333", "#33FF57"
  ];

  const totalFiber = Object.keys(aggregatedCounts)
    .filter((key) => key.includes("Fiber"))
    .reduce((total, key) => total + aggregatedCounts[key], 0);

  const totalCopper = Object.keys(aggregatedCounts)
    .filter((key) => key.includes("Copper"))
    .reduce((total, key) => total + aggregatedCounts[key], 0);

  return (
    <Box sx={{ minHeight: "100vh", background: "linear-gradient(to right, #141E30, #243B55)", padding: 4 }}>
      <Typography variant="h3" gutterBottom sx={{ textAlign: "center", color: "#fff", fontWeight: "bold", textShadow: "2px 2px 4px rgba(0, 0, 0, 0.5)" }}>
        ACCESS BAERER DAILY SALES REPORT
      </Typography>
      <Container maxWidth="lg">
        {/* Filters */}
        <Grid container spacing={2} justifyContent="center" sx={{ marginBottom: 4 }}>
          <Grid item xs={12} sm={4} md={3}>
            <FormControl fullWidth>
              <InputLabel sx={{ color: "#FFFFFF" }}>Year</InputLabel>
              <Select
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
                sx={{ backgroundColor: "#FFFFFF", borderRadius: 2 }}
              >
                <MenuItem value="all">All Years</MenuItem>
                {years.map((year) => (
                  <MenuItem key={year} value={year}>
                    {year}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={4} md={3}>
            <FormControl fullWidth>
              <InputLabel sx={{ color: "#FFFFFF" }}>Month</InputLabel>
              <Select
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
                sx={{ backgroundColor: "#FFFFFF", borderRadius: 2 }}
              >
                <MenuItem value="all">All Months</MenuItem>
                {months.map((month, index) => (
                  <MenuItem key={index + 1} value={index + 1}>
                    {month}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={4} md={3}>
            <FormControl fullWidth>
              <InputLabel sx={{ color: "#FFFFFF" }}>Day</InputLabel>
              <Select
                value={selectedDay}
                onChange={(e) => setSelectedDay(e.target.value)}
                sx={{ backgroundColor: "#FFFFFF", borderRadius: 2 }}
              >
                <MenuItem value="all">All Days</MenuItem>
                {days.map((day) => (
                  <MenuItem key={day} value={day}>
                    {day}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={4} md={3}>
            <Button
              variant="contained"
              color="primary"
              fullWidth
              onClick={applyFilters}
              sx={{ padding: "12px", fontWeight: "bold", textTransform: "none" }}
            >
              Apply Filters
            </Button>
          </Grid>
        </Grid>

        {/* Data Display */}
        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <Typography variant="h5" sx={{ fontWeight: "bold", color: "#FFFFFF", textAlign: "center" }}>Fiber Data - Total: {totalFiber}</Typography>
            {Object.keys(aggregatedCounts)
              .filter((key) => key.includes("Fiber"))
              .map((key, index) => (
                <Card sx={{ marginTop: 2, padding: 2, background: "linear-gradient(145deg, #1976D2, #2196F3)" }} key={index}>
                  <Typography variant="h6" sx={{ color: "#fff", textAlign: "center" }}>{key}</Typography>
                  <Typography variant="h4" sx={{ color: "#fff", textAlign: "center" }}>{aggregatedCounts[key]}</Typography>
                </Card>
              ))}
          </Grid>

          <Grid item xs={12} md={6}>
            <Typography variant="h5" sx={{ fontWeight: "bold", color: "#FFFFFF", textAlign: "center" }}>Copper Data - Total: {totalCopper}</Typography>
            {Object.keys(aggregatedCounts)
              .filter((key) => key.includes("Copper"))
              .map((key, index) => (
                <Card sx={{ marginTop: 2, padding: 2, background: "linear-gradient(145deg, #FF5733, #FF7043)" }} key={index}>
                  <Typography variant="h6" sx={{ color: "#fff", textAlign: "center" }}>{key}</Typography>
                  <Typography variant="h4" sx={{ color: "#fff", textAlign: "center" }}>{aggregatedCounts[key]}</Typography>
                </Card>
              ))}
          </Grid>
        </Grid>

        <Box sx={{ paddingTop: 5 }}>
          <Grid container spacing={4}>
            <Grid item xs={12} sm={6}>
              <ResponsiveContainer width="100%" height={400}>
                <PieChart>
                  <Pie data={pieDataFiber} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={150}>
                    {pieDataFiber.map((entry, index) => <Cell key={index} fill={COLORS[index % COLORS.length]} />)}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </Grid>
            <Grid item xs={12} sm={6}>
              <ResponsiveContainer width="100%" height={400}>
                <PieChart>
                  <Pie data={pieDataCopper} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={150}>
                    {pieDataCopper.map((entry, index) => <Cell key={index} fill={COLORS[index % COLORS.length]} />)}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </Grid>
          </Grid>
        </Box>
      </Container>
    </Box>
  );
};

export default FiberOrders;
