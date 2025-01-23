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
  Chip,
} from "@mui/material";
import { Tooltip, Legend, ResponsiveContainer } from "recharts";
import { LineChart, Line, XAxis, YAxis, CartesianGrid } from "recharts";
import { getCounts } from "../services/api";

const FiberOrders = () => {
  const [counts, setCounts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [selectedYear, setSelectedYear] = useState("all");
  const [selectedMonths, setSelectedMonths] = useState([]); // Changed to an array
  const [selectedDays, setSelectedDays] = useState([]); // Changed to an array
  const [filteredCounts, setFilteredCounts] = useState([]);
  const [activeFilters, setActiveFilters] = useState([]);
  const [hoveredLine, setHoveredLine] = useState("");  
  const [activeLines, setActiveLines] = useState(["NEW ACCESS BAERER", "NEW ON MIGRATION", "UPGRADES", "RECON"]);

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
      setActiveFilters((prev) => [...prev, `Year: ${selectedYear}`]);
    }
    if (selectedMonths.length > 0) {
      filtered = filtered.filter((item) => selectedMonths.includes(item.month));
      setActiveFilters((prev) => [...prev, `Months: ${selectedMonths.map((m) => months[m - 1]).join(", ")}`]);
    }
    if (selectedDays.length > 0) {
      filtered = filtered.filter((item) => selectedDays.includes(item.day));
      setActiveFilters((prev) => [...prev, `Days: ${selectedDays.join(", ")}`]);
    }
  
    setFilteredCounts(filtered); // Update filtered counts
  };
const CustomLegend = ({ payload, onToggle, activeLines }) => {
  return (
    <Box sx={{ display: "flex", justifyContent: "center", gap: 2, flexWrap: "wrap", padding: 2 }}>
      {payload.map((entry) => (
        <Button
          key={entry.value}
          onClick={() => onToggle(entry.value)}
          variant={activeLines.includes(entry.value) ? "contained" : "outlined"}
          sx={{
            borderRadius: 3,
            padding: "5px 10px",
            backgroundColor: activeLines.includes(entry.value) ? entry.color : "transparent",
            color: activeLines.includes(entry.value) ? "#fff" : entry.color,
            borderColor: entry.color,
            fontWeight: "bold",
            ":hover": {
              backgroundColor: entry.color,
              color: "#fff",
            },
          }}
        >
          {entry.value}
        </Button>
      ))}
    </Box>
  );
};
const handleToggleLine = (line) => {
  if (activeLines.includes(line)) {
    setActiveLines(activeLines.filter((activeLine) => activeLine !== line));
  } else {
    setActiveLines([...activeLines, line]);
  }
};
  const removeFilter = (filter) => {
    setActiveFilters((prev) => prev.filter((item) => item !== filter));
    // Reset filter logic
    if (filter.startsWith("Year")) {
      setSelectedYear("all");
    }
    if (filter.startsWith("Month")) {
      setSelectedMonths([]);
    }
    if (filter.startsWith("Day")) {
      setSelectedDays([]);
    }
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
  const years = [2023, 2024, 2025]; // Example years
  const months = [
    "January", "February", "March", "April", "May",
    "June", "July", "August", "September", "October",
    "November", "December"
  ];
  const days = Array.from({ length: 31 }, (_, i) => i + 1); // Days 1-31
  // Monthly Data Aggregation
const monthlyCounts = {
  fiber: Array(12).fill(0).map(() => ({
    "NEW ACCESS BAERER": 0,
    "RECON": 0,
    "NEW ON MIGRATION": 0,
  })),
  copper: Array(12).fill(0).map(() => ({
    "NEW ACCESS BAERER": 0,
    "RECON": 0,
  })),
};

filteredCounts.forEach((item) => {
  const monthIndex = item.month - 1; // Convert month to 0-indexed
   // Fiber category mappings
   if (item.category.includes("FTTH") && item.serviceType.includes("FTTH")) {
    switch (item.orderType) {
      case "CREATE": // New access bearer
        monthlyCounts.fiber[monthIndex]["NEW ACCESS BAERER"] += item.count;
        break;
      case "CREATE-UPGRD SAME NO": // Migration upgrades
        monthlyCounts.fiber[monthIndex]["NEW ON MIGRATION"] += item.count;
        break;
      case "CREATE-RECON": // Reconnections
        monthlyCounts.fiber[monthIndex]["RECON"] += item.count; // Ensure correct mapping for reconnections
        break;
      default:
        break;
    }
  
  } else if (item.category === "Other" && item.serviceType.includes("CAB")) {
    switch (item.orderType) {
      case "CREATE":
        monthlyCounts.copper[monthIndex]["NEW ACCESS BAERER"] += item.count;
        break;
      case "CREATE-RECON":
        monthlyCounts.copper[monthIndex]["RECON"] += item.count;
        break;
      default:
        break;
    }
  }
});

const lineDataFiber = months.map((month, index) => ({
  month,
  "NEW ACCESS BAERER": monthlyCounts.fiber[index]["NEW ACCESS BAERER"],
  "NEW ON MIGRATION": monthlyCounts.fiber[index]["NEW ON MIGRATION"],
  "RECON": monthlyCounts.fiber[index]["RECON"],
}));

const lineDataCopper = months.map((month, index) => ({
  month,
  "NEW ACCESS BAERER": monthlyCounts.copper[index]["NEW ACCESS BAERER"],
  "RECON": monthlyCounts.copper[index]["RECON"],
}));
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

  const grandTotal = (totalFiber + totalCopper).toLocaleString(); // Grand total with commas

  return (
    <Box sx={{ 
      minHeight: "100vh", 
      background: `url(/BG.jpg), linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.7))`,
      backgroundSize: "cover", 
      backgroundPosition: "center", 
      padding: 4,
    }}>
      <Typography 
        variant="h3" 
        gutterBottom 
        sx={{
          textAlign: "center", 
          color: "#fff", 
          fontWeight: "bold", 
          textShadow: "2px 2px 4px rgba(0, 0, 0, 0.7)"
        }}
      >
        ACCESS BAERER DAILY SALES REPORT
      </Typography>
      <Typography 
        variant="h4" 
        sx={{ 
          textAlign: "center", 
          color: "#ffcc00", 
          fontWeight: "bold", 
          marginBottom: 3 
        }}
      >
       <Box sx={{ backgroundColor: "#3F51B5", color: "#fff", padding: 2, borderRadius: 2, marginBottom: 3 }}>
                <Typography variant="h5" sx={{ fontWeight: "bold", textAlign: "center" }}>
                  Grand Total (Fiber + Copper): {grandTotal}
                </Typography>
              </Box>
      </Typography>

      <Container maxWidth="lg">
      <Grid container spacing={2} justifyContent="center" sx={{ marginBottom: 4 }}>
        {/* Year Selection */}
        <Grid item xs={12} sm={4} md={3}>
          <FormControl fullWidth>
            <InputLabel sx={{ color: "#FFFFFF" }}>Year</InputLabel>
            <Select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              sx={{ backgroundColor: "#333333", color: "#FFFFFF", borderRadius: 2 }}
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
      
        {/* Month Selection */}
        <Grid item xs={12} sm={4} md={3}>
          <FormControl fullWidth>
            <InputLabel sx={{ color: "#FFFFFF" }}>Month</InputLabel>
            <Select
              multiple
              value={selectedMonths}
              onChange={(e) => setSelectedMonths(e.target.value)}
              sx={{ backgroundColor: "#333333", color: "#FFFFFF", borderRadius: 2 }}
              renderValue={(selected) =>
                selected.length ? selected.join(", ") : "Select Month(s)"
              }
            >
              <MenuItem
                value="select-all"
                onClick={() =>
                  setSelectedMonths(selectedMonths.length === months.length ? [] : months.map((_, i) => i + 1))
                }
              >
              </MenuItem>
              {months.map((month, index) => (
                <MenuItem key={index + 1} value={index + 1}>
                  <Box display="flex" alignItems="center">
                    <input
                      type="checkbox"
                      checked={selectedMonths.includes(index + 1)}
                      style={{ marginRight: 8 }}
                    />
                    {month}
                  </Box>
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        {/* Day Selection */}
        <Grid item xs={12} sm={4} md={3}>
          <FormControl fullWidth>
            <InputLabel sx={{ color: "#FFFFFF" }}>Day</InputLabel>
            <Select
              multiple
              value={selectedDays}
              onChange={(e) => setSelectedDays(e.target.value)}
              sx={{ backgroundColor: "#333333", color: "#FFFFFF", borderRadius: 2 }}
              renderValue={(selected) =>
                selected.length ? selected.join(", ") : "Select Day(s)"
              }
            >
              <MenuItem
                value="select-all"
                onClick={() =>
                  setSelectedDays(selectedDays.length === days.length ? [] : days)
                }
              >
              </MenuItem>
              {days.map((day) => (
                <MenuItem key={day} value={day}>
                  <Box display="flex" alignItems="center">
                    <input
                      type="checkbox"
                      checked={selectedDays.includes(day)}
                      style={{ marginRight: 8 }}
                    />
                    {day}
                  </Box>
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
      
      {/* Apply and Clear Filters Buttons */}
      <Grid item xs={12} sm={4} md={3}>
        <Box display="flex" gap={2} justifyContent="space-between" alignItems="center">
          {/* Apply Filters Button */}
          <Button
            variant="contained"
            fullWidth
            onClick={applyFilters}
            sx={{
              padding: "12px",
              fontWeight: "bold",
              textTransform: "none",
              backgroundColor: "linear-gradient(135deg, #42a5f5, #1e88e5)",
              color: "#fff",
              borderRadius: "8px",
              boxShadow: "0 4px 12px rgba(30, 136, 229, 0.3)",
              ":hover": {
                backgroundColor: "linear-gradient(135deg, #64b5f6, #1565c0)",
                boxShadow: "0 4px 16px rgba(13, 71, 161, 0.4)",
              },
            }}
          >
            Apply Filters
          </Button>
      
          {/* Clear Filters Button */}
          <Button
            variant="outlined"
            fullWidth
            onClick={() => {
              setSelectedYear("all");
              setSelectedMonths([]);
              setSelectedDays([]);
              setFilteredCounts(counts); // Reset filtered data to show all
            }}
            sx={{
              padding: "12px",
              fontWeight: "bold",
              textTransform: "none",
              display: "flex",
              alignItems: "center",
              gap: 1,
              borderRadius: "8px",
              border: "2px solid",
              borderColor: "#90caf9",
              color: "#90caf9",
              backgroundColor: "transparent",
              boxShadow: "0 4px 8px rgba(144, 202, 249, 0.1)",
              ":hover": {
                backgroundColor: "#e3f2fd",
                color: "#0d47a1",
                borderColor: "#64b5f6",
                boxShadow: "0 4px 16px rgba(100, 181, 246, 0.4)",
              },
            }}
          >
            <i className="fas fa-undo" style={{ fontSize: "20px" }}></i> Clear Filters
          </Button>
        </Box>
      </Grid>
      </Grid>

        {/* Data Display */}
        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <Typography variant="h5" sx={{ fontWeight: "bold", color: "#FFFFFF", textAlign: "center" }}>
              Fiber Data - Total: {totalFiber.toLocaleString()}
            </Typography>
            {Object.keys(aggregatedCounts)
              .filter((key) => key.includes("Fiber"))
              .map((key, index) => (
                <Card sx={{ marginTop: 2, padding: 2, background: "linear-gradient(145deg, #0A237D, #0D47A1)" }} key={index}>
                  <Typography variant="h6" sx={{ color: "#fff", textAlign: "center" }}>{key}</Typography>
                  <Typography variant="h4" sx={{ color: "#fff", textAlign: "center" }}>
                    {aggregatedCounts[key].toLocaleString()}
                  </Typography>
                </Card>
              ))}
          </Grid>

          <Grid item xs={12} md={6}>
            <Typography variant="h5" sx={{ fontWeight: "bold", color: "#FFFFFF", textAlign: "center" }}>
              Copper Data - Total: {totalCopper.toLocaleString()}
            </Typography>
            {Object.keys(aggregatedCounts)
              .filter((key) => key.includes("Copper"))
              .map((key, index) => (
                <Card sx={{ marginTop: 2, padding: 2, background: "linear-gradient(145deg, #1B5E20, #388E3C)" }} key={index}>
                  <Typography variant="h6" sx={{ color: "#fff", textAlign: "center" }}>{key}</Typography>
                  <Typography variant="h4" sx={{ color: "#fff", textAlign: "center" }}>
                    {aggregatedCounts[key].toLocaleString()}
                  </Typography>
                </Card>
              ))}
          </Grid>
        </Grid>
        {/* Line Charts */}
<Box sx={{ paddingTop: 5 }}>
<Container maxWidth="lg">
  <Box sx={{ paddingTop: 5 }}>
    <Grid container spacing={4}>
      {/* Fiber Line Chart with Dark Background */}
      <Grid item xs={12} md={6}>
        <Box
          sx={{
            backgroundColor: "rgba(15, 15, 40, 0.9)", // Darker background
            borderRadius: 4,
            padding: 3,
            boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.4)",
          }}
        >
          <Typography variant="h5" sx={{ fontWeight: "bold", textAlign: "center", color: "#fff", marginBottom: 2 }}>
            Fiber Data Trend (Monthly)
          </Typography>
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={lineDataFiber} margin={{ top: 20, right: 30, left: 0, bottom: 50 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#555" opacity={0.3} />
              <XAxis dataKey="month" tick={{ fill: "#fff" }} angle={-45} textAnchor="end" interval={0} />
              <YAxis tick={{ fill: "#fff" }} />
              <Tooltip contentStyle={{ backgroundColor: "#1e2735", borderRadius: 8 }} labelStyle={{ color: "#fff" }} />
              <Legend
                wrapperStyle={{
                  position: "absolute",
                  bottom: -40,
                  left: 0,
                  right: 0,
                  display: "flex",
                  justifyContent: "center",
                }}
                content={
                  <CustomLegend
                    payload={[
                      { value: "NEW ACCESS BAERER", dataKey: "NEW ACCESS BAERER", color: "#00bfff" },
                      { value: "NEW ON MIGRATION", dataKey: "NEW ON MIGRATION", color: "#ff6384" },
                      { value: "UPGRADES", dataKey: "UPGRADES", color: "#ffc658" },
                      { value: "RECON", dataKey: "RECON", color: "#4caf50" },
                    ]}
                    onToggle={handleToggleLine}
                    activeLines={activeLines}
                  />
                }
              />
              {activeLines.includes("NEW ACCESS BAERER") && (
                <Line type="monotone" dataKey="NEW ACCESS BAERER" stroke="#00bfff" strokeWidth={4} dot={{ r: 5 }} />
              )}
              {activeLines.includes("NEW ON MIGRATION") && (
                <Line type="monotone" dataKey="NEW ON MIGRATION" stroke="#ff6384" strokeWidth={4} dot={{ r: 5 }} />
              )}
              {activeLines.includes("RECON") && (
                <Line type="monotone" dataKey="RECON" stroke="#4caf50" strokeWidth={4} dot={{ r: 5 }} />
              )}
            </LineChart>
          </ResponsiveContainer>
        </Box>
      </Grid>
      {/* Copper Line Chart with Dark Background */}
      <Grid item xs={12} md={6}>
        <Box
          sx={{
            backgroundColor: "rgba(15, 15, 40, 0.9)", // Darker background
            borderRadius: 4,
            padding: 3,
            boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.4)",
          }}
        >
          <Typography variant="h5" sx={{ fontWeight: "bold", textAlign: "center", color: "#fff", marginBottom: 2 }}>
            Copper Data Trend (Monthly)
          </Typography>
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={lineDataCopper} margin={{ top: 20, right: 30, left: 0, bottom: 50 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#555" opacity={0.3} />
              <XAxis dataKey="month" tick={{ fill: "#fff" }} angle={-45} textAnchor="end" interval={0} />
              <YAxis tick={{ fill: "#fff" }} />
              <Tooltip contentStyle={{ backgroundColor: "#1e2735", borderRadius: 8 }} labelStyle={{ color: "#fff" }} />
              <Legend
                wrapperStyle={{
                  position: "absolute",
                  bottom: -40,
                  left: 0,
                  right: 0,
                  display: "flex",
                  justifyContent: "center",
                }}
                content={
                  <CustomLegend
                    payload={[
                      { value: "NEW ACCESS BAERER", dataKey: "NEW ACCESS BAERER", color: "#00bfff" },
                      { value: "RECON", dataKey: "RECON", color: "#4caf50" },
                    ]}
                    onToggle={handleToggleLine}
                    activeLines={activeLines}
                  />
                }
              />
              {activeLines.includes("NEW ACCESS BAERER") && (
                <Line type="monotone" dataKey="NEW ACCESS BAERER" stroke="#00bfff" strokeWidth={4} dot={{ r: 5 }} />
              )}
              {activeLines.includes("RECON") && (
                <Line type="monotone" dataKey="RECON" stroke="#4caf50" strokeWidth={4} dot={{ r: 5 }} />
              )}
            </LineChart>
          </ResponsiveContainer>
        </Box>
      </Grid>
    </Grid>
  </Box>
  {/* Reset Button outside Grid */}
  <Box textAlign="center" marginTop={3}>
    <Button
      onClick={() => setActiveLines(["NEW ACCESS BAERER", "NEW ON MIGRATION", "UPGRADES", "RECON"])}
      variant="contained"
      sx={{
        backgroundColor: "#1e88e5",
        color: "#fff",
        marginTop: 4,
        fontWeight: "bold",
        ":hover": { backgroundColor: "#1565c0" },
      }}
    >
      Reset All Lines
    </Button>
  </Box>
</Container>
</Box>
      </Container>
    </Box>
  );
};

export default FiberOrders;