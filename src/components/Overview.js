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
import { Tooltip, Legend, ResponsiveContainer } from "recharts";
import { getCounts } from "../services/api"; // Assuming you have an API service to fetch data
import { LineChart, Line, XAxis, YAxis, CartesianGrid } from "recharts";
const Overview = () => {
  const [counts, setCounts] = useState([]);
  const [filteredCounts, setFilteredCounts] = useState([]); // For filtered data
  const [loading, setLoading] = useState(true);
  const [hoveredLine, setHoveredLine] = useState("");
  const [activeLines, setActiveLines] = useState(["NEW ACCESS BAERER", "NEW ON MIGRATION", "UPGRADES", "RECON"]);

  // Filters
  const [selectedYear, setSelectedYear] = useState("all");
  const [selectedMonth, setSelectedMonth] = useState([]);  // Changed from "all" to []
  const [selectedDay, setSelectedDay] = useState([]);  // Changed from "all" to []

  useEffect(() => {
    const fetchCounts = async () => {
      try {
        setLoading(true);
        const data = await getCounts(); // Replace with your API call
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
        setFilteredCounts(formattedData); // Initially, show all data
      } catch (error) {
        console.error("Error loading data", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCounts();
  }, []);

  const handleToggleLine = (dataKey) => {
    setActiveLines((prevLines) =>
      prevLines.includes(dataKey) ? prevLines.filter((line) => line !== dataKey) : [...prevLines, dataKey]
    );
  };
// Custom Legend Component
const CustomLegend = ({ payload, onToggle, activeLines }) => (
  <Box sx={{ display: "flex", justifyContent: "center", gap: 3, flexWrap: "wrap", marginBottom: 2 }}>
    {payload.map((entry, index) => (
      <Box
        key={index}
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1,
          padding: "6px 12px",
          backgroundColor: activeLines.includes(entry.dataKey) ? "rgba(255, 255, 255, 0.3)" : "rgba(255, 255, 255, 0.1)",
          borderRadius: "8px",
          cursor: "pointer",
          boxShadow: activeLines.includes(entry.dataKey) ? "0px 0px 12px rgba(255, 255, 255, 0.5)" : "none",
          ":hover": {
            backgroundColor: "rgba(255, 255, 255, 0.5)",
            transform: "scale(1.05)",
          },
        }}
        onClick={() => onToggle(entry.dataKey)}
      >
        <Box
          sx={{
            width: 20,
            height: 20,
            backgroundColor: entry.color,
            borderRadius: "50%",
            boxShadow: "0px 0px 8px rgba(0, 0, 0, 0.5)",
          }}
        />
        <Typography sx={{ color: "#fff", fontWeight: "bold" }}>{entry.value}</Typography>
      </Box>
    ))}
  </Box>
);
const applyFilters = () => {
  let filtered = counts;

  if (selectedYear !== "all") {
    filtered = filtered.filter((item) => item.year === parseInt(selectedYear, 10));
  }
  if (selectedMonth.length > 0) {  // Check for multiple months
    filtered = filtered.filter((item) => selectedMonth.includes(item.month));
  }
  if (selectedDay.length > 0) {  // Check for multiple days
    filtered = filtered.filter((item) => selectedDay.includes(item.day));
  }

  setFilteredCounts(filtered);
};
  if (loading) {
    return (
      <Box sx={{ minHeight: "100vh", background: "linear-gradient(to right, #141E30, #243B55)", padding: 3 }}>
        <LinearProgress color="primary" />
      </Box>
    );
  }

  const aggregatedCounts = {
    "Fiber - PEOTV NEW ACCESS BAERER": 0,
    "Fiber - PEOTV NEW ON MIGRATION": 0,
    "Fiber - PEOTV UPGRADES": 0,
    "Fiber - PEOTV RECON": 0,
    "Copper - PEOTV NEW ACCESS BAERER": 0,
    "Copper - PEOTV NEW ON MIGRATION": 0,
    "Copper - PEOTV UPGRADES": 0,
    "Copper - PEOTV RECON": 0,
  };

  filteredCounts.forEach((item) => {
    const combinedKey = `${item.category} - ${item.serviceType} - ${item.orderType}`;
    switch (combinedKey) {
      case "PEO_NEW_53K - E-IPTV FTTH - CREATE":
        aggregatedCounts["Fiber - PEOTV NEW ACCESS BAERER"] += item.count;
        break;
      case "PEO_NEW_53K - E-IPTV FTTH - CREATE-UPGRD SAME NO":
        aggregatedCounts["Fiber - PEOTV NEW ON MIGRATION"] += item.count;
        break;
      case "PEO_NEW_53K - E-IPTV COPPER - CREATE":
        aggregatedCounts["Copper - PEOTV NEW ACCESS BAERER"] += item.count;
        break;
      case "PEO DP BB Up_30K - E-IPTV FTTH - CREATE":
        aggregatedCounts["Fiber - PEOTV UPGRADES"] += item.count;
        break;
      case "PEO DP BB Up_30K - E-IPTV COPPER - CREATE":
        aggregatedCounts["Copper - PEOTV UPGRADES"] += item.count;
        break;
      case "PEO_REC_6K - E-IPTV FTTH - CREATE-RECON":
        aggregatedCounts["Fiber - PEOTV RECON"] += item.count;
        break;
      case "PEO_REC_6K - E-IPTV COPPER - CREATE-RECON":
        aggregatedCounts["Copper - PEOTV RECON"] += item.count;
        break;
      default:
        break;
    }
  });

  const years = [2023, 2024]; // Example years
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  const days = Array.from({ length: 31 }, (_, i) => i + 1); // Days 1-31
  // Initialize monthly data
const monthlyCounts = {
  fiber: Array(12).fill(0).map(() => ({
    "NEW ACCESS BAERER": 0,
    "NEW ON MIGRATION": 0,
    "UPGRADES": 0,
    "RECON": 0,
  })),
  copper: Array(12).fill(0).map(() => ({
    "NEW ACCESS BAERER": 0,
    "UPGRADES": 0,
    "RECON": 0,
  })),
};

// Aggregate monthly data
filteredCounts.forEach((item) => {
  const monthIndex = item.month - 1; // Convert to 0-indexed (January = 0)
  if (item.category === "PEO_NEW_53K" && item.serviceType.includes("FTTH")) {
    switch (item.orderType) {
      case "CREATE":
        monthlyCounts.fiber[monthIndex]["NEW ACCESS BAERER"] += item.count;
        break;
      case "CREATE-UPGRD SAME NO":
        monthlyCounts.fiber[monthIndex]["NEW ON MIGRATION"] += item.count;
        break;
      
      default:
        break;
    }
  } else if (item.category === "PEO_NEW_53K" && item.serviceType.includes("COPPER")) {
    switch (item.orderType) {
      case "CREATE":
        monthlyCounts.copper[monthIndex]["NEW ACCESS BAERER"] += item.count;
        break;
      default:
        break;
    }
  }

  else if (item.category === "PEO DP BB Up_30K") {
    if (item.serviceType.includes("FTTH")) {
      monthlyCounts.fiber[monthIndex]["UPGRADES"] += item.count;
    } else if (item.serviceType.includes("COPPER")) {
      monthlyCounts.copper[monthIndex]["UPGRADES"] += item.count;
    }
  }
  else if (item.category === "PEO_REC_6K") {
    if (item.serviceType.includes("FTTH")) {
      monthlyCounts.fiber[monthIndex]["RECON"] += item.count;
    } else if (item.serviceType.includes("COPPER")) {
      monthlyCounts.copper[monthIndex]["RECON"] += item.count;
    }
  }
});

// Line chart data for Fiber
// Line chart data for Fiber
const lineDataFiber = months.map((month, index) => ({
  month,
  "NEW ACCESS BAERER": monthlyCounts.fiber[index]["NEW ACCESS BAERER"],
  "NEW ON MIGRATION": monthlyCounts.fiber[index]["NEW ON MIGRATION"],
  "UPGRADES": monthlyCounts.fiber[index]["UPGRADES"],
  "RECON": monthlyCounts.fiber[index]["RECON"],
}));

// Line chart data for Copper
const lineDataCopper = months.map((month, index) => ({
  month,
  "NEW ACCESS BAERER": monthlyCounts.copper[index]["NEW ACCESS BAERER"],
  "UPGRADES": monthlyCounts.copper[index]["UPGRADES"],
  "RECON": monthlyCounts.copper[index]["RECON"],
}));
  const COLORS = [
    "#FFBB28", "#FF8042", "#00C49F", "#0088FE", "#FF00FF", "#FF3333", "#33FF57",
  ];


  const totalFiber = Object.keys(aggregatedCounts)
    .filter((key) => key.includes("Fiber"))
    .reduce((total, key) => total + aggregatedCounts[key], 0)
    .toLocaleString(); // Added commas

  const totalCopper = Object.keys(aggregatedCounts)
    .filter((key) => key.includes("Copper"))
    .reduce((total, key) => total + aggregatedCounts[key], 0)
    .toLocaleString(); // Added commas

  const grandTotal = (
    Object.keys(aggregatedCounts)
      .reduce((total, key) => total + aggregatedCounts[key], 0)
  ).toLocaleString(); // Grand total (Fiber + Copper)

  return (
    <Box sx={{ 
      minHeight: "100vh", 
      background: `url(/BG.jpg), linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.7))`,  // Darker gradient to make background more dim
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
        PEOTV DAILY SALES REPORT
      </Typography>

      <Container maxWidth="lg">
        {/* Total Summary */}
        <Box sx={{ backgroundColor: "#3F51B5", color: "#fff", padding: 2, borderRadius: 2, marginBottom: 3 }}>
          <Typography variant="h5" sx={{ fontWeight: "bold", textAlign: "center" }}>
            Grand Total (Fiber + Copper): {grandTotal}
          </Typography>
        </Box>
{/* Filters */}
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
        value={selectedMonth}
        onChange={(e) => setSelectedMonth(e.target.value)}
        sx={{ backgroundColor: "#333333", color: "#FFFFFF", borderRadius: 2 }}
        renderValue={(selected) =>
          selected.length ? selected.join(", ") : "Select Month(s)"
        }
      >
        <MenuItem
          value="select-all"
          onClick={() =>
            setSelectedMonth(selectedMonth.length === months.length ? [] : months.map((_, i) => i + 1))
          }
        >
        </MenuItem>
        {months.map((month, index) => (
          <MenuItem key={index + 1} value={index + 1}>
            <Box display="flex" alignItems="center">
              <input
                type="checkbox"
                checked={selectedMonth.includes(index + 1)}
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
        value={selectedDay}
        onChange={(e) => setSelectedDay(e.target.value)}
        sx={{ backgroundColor: "#333333", color: "#FFFFFF", borderRadius: 2 }}
        renderValue={(selected) =>
          selected.length ? selected.join(", ") : "Select Day(s)"
        }
      >
        <MenuItem
          value="select-all"
          onClick={() =>
            setSelectedDay(selectedDay.length === days.length ? [] : days)
          }
        >
        </MenuItem>
        {days.map((day) => (
          <MenuItem key={day} value={day}>
            <Box display="flex" alignItems="center">
              <input
                type="checkbox"
                checked={selectedDay.includes(day)}
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
        setSelectedMonth([]);
        setSelectedDay([]);
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
              Fiber Data - Total: {totalFiber}
            </Typography>
            {Object.keys(aggregatedCounts)
              .filter((key) => key.includes("Fiber"))
              .map((key, index) => (
                <Card
                  sx={{
                    marginTop: 2,
                    padding: 2,
                    background: "linear-gradient(145deg, #0A237D, #0D47A1)",  // Darker blue gradient for Fiber
                  }}
                  key={index}
                >
                  <Typography variant="h6" sx={{ color: "#fff", textAlign: "center" }}>{key}</Typography>
                  <Typography variant="h4" sx={{ color: "#fff", textAlign: "center" }}>
                    {aggregatedCounts[key].toLocaleString()}
                  </Typography>
                </Card>
              ))}
          </Grid>

          <Grid item xs={12} md={6}>
            <Typography variant="h5" sx={{ fontWeight: "bold", color: "#FFFFFF", textAlign: "center" }}>
              Copper Data - Total: {totalCopper}
            </Typography>
            {Object.keys(aggregatedCounts)
              .filter((key) => key.includes("Copper"))
              .map((key, index) => (
                <Card
                  sx={{
                    marginTop: 2,
                    padding: 2,
                    background: "linear-gradient(145deg, #1B5E20, #388E3C)",  // Darker green gradient for Copper
                  }}
                  key={index}
                >
                  <Typography variant="h6" sx={{ color: "#fff", textAlign: "center" }}>{key}</Typography>
                  <Typography variant="h4" sx={{ color: "#fff", textAlign: "center" }}>
                    {aggregatedCounts[key].toLocaleString()}
                  </Typography>
                </Card>
              ))}
          </Grid>
        </Grid>
        <Grid container spacing={4}>
  {/* Fiber Line Chart (Left) */}
  <Grid item xs={12} md={6}>
    <Box sx={{ padding: 3, backgroundColor: "rgba(0, 0, 0, 0.2)", borderRadius: 2 }}>
      <Typography variant="h5" sx={{ fontWeight: "bold", textAlign: "center", color: "#ffffff", marginBottom: 2 }}>
        Fiber Data Trend (Monthly)
      </Typography>
      <ResponsiveContainer width="100%" height={400}>
        <LineChart data={lineDataFiber} margin={{ top: 20, right: 30, left: 0, bottom: 50 }}>
          <defs>
            <linearGradient id="bgFiber" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#003366" stopOpacity={0.3} />
              <stop offset="100%" stopColor="#001f3f" stopOpacity={0.1} />
            </linearGradient>
          </defs>
          <rect width="100%" height="100%" fill="url(#bgFiber)" />
          <CartesianGrid strokeDasharray="3 3" stroke="#555" opacity={0.3} />
          <XAxis dataKey="month" tick={{ fill: "#fff" }} angle={-45} textAnchor="end" interval={0} />
          <YAxis tick={{ fill: "#fff" }} />
          <Tooltip
            contentStyle={{
              backgroundColor: "#1e2735",
              borderRadius: 8,
              border: "none",
            }}
            labelStyle={{ fontWeight: "bold", color: "#fff" }}
            formatter={(value, name) => [`${value.toLocaleString()} Orders`, `${name}`]}
          />
<Legend
  wrapperStyle={{
    position: "absolute",
    bottom: -40, // Moves the legend down (adjust this value as needed)
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
            <Line
              type="monotone"
              dataKey="NEW ACCESS BAERER"
              stroke="#00bfff"
              strokeWidth={hoveredLine === "NEW ACCESS BAERER" ? 5 : 3}
              dot={{ r: 6, fill: "#00bfff" }}
              activeDot={{ r: 10, strokeWidth: 2, fill: "#00e1ff" }}
            />
          )}
          {activeLines.includes("NEW ON MIGRATION") && (
            <Line
              type="monotone"
              dataKey="NEW ON MIGRATION"
              stroke="#ff6384"
              strokeWidth={hoveredLine === "NEW ON MIGRATION" ? 5 : 3}
              dot={{ r: 6, fill: "#ff6384" }}
              activeDot={{ r: 10, strokeWidth: 2, fill: "#ffa1b2" }}
            />
          )}
          {activeLines.includes("UPGRADES") && (
            <Line
              type="monotone"
              dataKey="UPGRADES"
              stroke="#ffc658"
              strokeWidth={hoveredLine === "UPGRADES" ? 5 : 3}
              dot={{ r: 6, fill: "#ffc658" }}
              activeDot={{ r: 10, strokeWidth: 2, fill: "#ffe480" }}
            />
          )}
          {activeLines.includes("RECON") && (
            <Line
              type="monotone"
              dataKey="RECON"
              stroke="#4caf50"
              strokeWidth={hoveredLine === "RECON" ? 5 : 3}
              dot={{ r: 6, fill: "#4caf50" }}
              activeDot={{ r: 10, strokeWidth: 2, fill: "#8bc34a" }}
            />
          )}
        </LineChart>
      </ResponsiveContainer>
    </Box>
  </Grid>

  {/* Copper Line Chart (Right) */}
  <Grid item xs={12} md={6}>
    <Box sx={{ padding: 3, backgroundColor: "rgba(0, 0, 0, 0.2)", borderRadius: 2 }}>
      <Typography variant="h5" sx={{ fontWeight: "bold", textAlign: "center", color: "#ffffff", marginBottom: 2 }}>
        Copper Data Trend (Monthly)
      </Typography>
      <ResponsiveContainer width="100%" height={400}>
        <LineChart data={lineDataCopper} margin={{ top: 20, right: 30, left: 0, bottom: 50 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#555" opacity={0.3} />
          <XAxis dataKey="month" tick={{ fill: "#fff" }} angle={-45} textAnchor="end" interval={0} />
          <YAxis tick={{ fill: "#fff" }} />
          <Tooltip
            contentStyle={{
              backgroundColor: "#1e2735",
              borderRadius: 8,
              border: "none",
            }}
            labelStyle={{ fontWeight: "bold", color: "#fff" }}
            formatter={(value, name) => [`${value.toLocaleString()} Orders`, `${name}`]}
          />
          <Legend
           wrapperStyle={{
            position: "absolute",
            bottom: -40, // Moves the legend down (adjust this value as needed)
            left: 0,
            right: 0,
            display: "flex",
            justifyContent: "center",
          }}
            content={
              <CustomLegend
                payload={[
                  { value: "NEW ACCESS BAERER", dataKey: "NEW ACCESS BAERER", color: "#00bfff" },
                  { value: "UPGRADES", dataKey: "UPGRADES", color: "#ffc658" },
                  { value: "RECON", dataKey: "RECON", color: "#4caf50" },
                ]}
                onToggle={handleToggleLine}
                activeLines={activeLines}
              />
            }
          />
          {activeLines.includes("NEW ACCESS BAERER") && (
            <Line
              type="monotone"
              dataKey="NEW ACCESS BAERER"
              stroke="#00bfff"
              strokeWidth={hoveredLine === "NEW ACCESS BAERER" ? 5 : 3}
              dot={{ r: 6, fill: "#00bfff" }}
              activeDot={{ r: 10, strokeWidth: 2, fill: "#00e1ff" }}
            />
          )}
          {activeLines.includes("UPGRADES") && (
            <Line
              type="monotone"
              dataKey="UPGRADES"
              stroke="#ffc658"
              strokeWidth={hoveredLine === "UPGRADES" ? 5 : 3}
              dot={{ r: 6, fill: "#ffc658" }}
              activeDot={{ r: 10, strokeWidth: 2, fill: "#ffe480" }}
            />
          )}
          {activeLines.includes("RECON") && (
            <Line
              type="monotone"
              dataKey="RECON"
              stroke="#4caf50"
              strokeWidth={hoveredLine === "RECON" ? 5 : 3}
              dot={{ r: 6, fill: "#4caf50" }}
              activeDot={{ r: 10, strokeWidth: 2, fill: "#8bc34a" }}
            />
          )}
        </LineChart>
      </ResponsiveContainer>
    </Box>
  </Grid>
</Grid>
  {/* Reset Button outside Grid */}
   <Box textAlign="center" marginTop={3}>
     <Button
       onClick={() => setActiveLines(["NEW ACCESS BAERER", "NEW ON MIGRATION", "UPGRADES", "RECON"])}
       variant="contained"
       sx={{
         backgroundColor: "#1e88e5",
         color: "#fff",
         fontWeight: "bold",
         ":hover": { backgroundColor: "#1565c0" },
       }}
     >
       Reset All Lines
     </Button>
   </Box>
      </Container>
    </Box>
  );
};

export default Overview;