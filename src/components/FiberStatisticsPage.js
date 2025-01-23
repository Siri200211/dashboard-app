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
} from "@mui/material";
import { getCounts } from "../services/api"; // Ensure this API function is correct
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
const FiberStatisticsPage = () => {
  const [counts, setCounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMonth, setSelectedMonth] = useState("all");
  // State to track line visibility
const [lineVisibility, setLineVisibility] = useState({
  fiberNewPercentage: true,
  fiberReconPercentage: true,
  fiberMigrationPercentage: true,
  copperNewPercentage: true,
  copperReconPercentage: true,
});

// Function to handle legend click for toggling lines
const handleLegendClick = (e) => {
  const { dataKey } = e; // The dataKey corresponds to the line’s key
  setLineVisibility((prev) => ({
    ...prev,
    [dataKey]: !prev[dataKey], // Toggle visibility
  }));
};

// Function to reset all lines visibility
const resetAllLines = () => {
  setLineVisibility({
    fiberNewPercentage: true,
    fiberReconPercentage: true,
    fiberMigrationPercentage: true,
    copperNewPercentage: true,
    copperReconPercentage: true,
  });
};
  useEffect(() => {
    const fetchCounts = async () => {
      try {
        const data = await getCounts();
        const formattedData = data.map((item) => ({
          category: item._id.category,
          orderType: item._id.oss_service_order_type,
          count: item.count,
          month: item._id.month, // Ensure month is 0-based
          serviceType: item._id.order_line_oss_service_type,
        }));
        setCounts(formattedData);
      } catch (error) {
        console.error("Error loading data", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCounts();
  }, []);

  if (loading) {
    return (
      <Box sx={{ minHeight: "100vh", background: "linear-gradient(to right, #141E30, #243B55)", padding: 3 }}>
        <LinearProgress color="primary" />
      </Box>
    );
  }

  const handleMonthSelect = (event) => {
    setSelectedMonth(event.target.value);
  };

  const filteredCounts =
    selectedMonth === "all"
      ? counts
      : counts.filter((item) => item.month === selectedMonth); // Adjust for 1-based selection

  const aggregatedCounts = {
    "FIBER NEW ACCESS BAERER": 0,
    "PEO TV NEW ACCESS BAERER (FIBER)": 0,
    "FIBER NEW ON MIGRATION": 0,
    "FIBER RECON": 0,
    "COPPER NEW": 0,
    "COPPER RECON": 0,
    "PEO TV NEW ON MIGRATION": 0,
    "PEO TV NEW ACCESS BAERER (COPPER)": 0,
    "PEO TV BB UP (FIBER)": 0,
    "PEO TV BB UP (COPPER)": 0,
    "PEO TV RECON (FIBER)": 0,
    "PEO TV RECON (COPPER)": 0,
  };

  // Aggregate counts based on category and service type
  filteredCounts.forEach((item) => {
    const combinedKey = `${item.category} - ${item.serviceType} - ${item.orderType}`;
    switch (combinedKey) {
      case "FTTH_NEW_132K - AB-FTTH - CREATE":
        aggregatedCounts["FIBER NEW ACCESS BAERER"] += item.count;
        break;
      case "PEO_NEW_53K - E-IPTV FTTH - CREATE":
        aggregatedCounts["PEO TV NEW ACCESS BAERER (FIBER)"] += item.count;
        break;
      case "PEO_NEW_53K - E-IPTV FTTH - CREATE-UPGRD SAME NO":
        aggregatedCounts["PEO TV NEW ON MIGRATION"] += item.count;
        break;
      case "PEO_NEW_53K - E-IPTV COPPER - CREATE":
        aggregatedCounts["PEO TV NEW ACCESS BAERER (COPPER)"] += item.count;
        break;
      case "PEO_DP BB Up_30K - E-IPTV FTTH - CREATE":
        aggregatedCounts["PEO TV BB UP (FIBER)"] += item.count;
        break;
      case "PEO_DP BB Up_30K - E-IPTV COPPER - CREATE":
        aggregatedCounts["PEO TV BB UP (COPPER)"] += item.count;
        break;
      case "PEO_REC_6K - E-IPTV FTTH - CREATE-RECON":
        aggregatedCounts["PEO TV RECON (FIBER)"] += item.count;
        break;
      case "PEO_REC_6K - E-IPTV COPPER - CREATE-RECON":
        aggregatedCounts["PEO TV RECON (COPPER)"] += item.count;
        break;
      case "FTTH_NEW_132K - AB-FTTH - CREATE-UPGRD SAME NO":
        aggregatedCounts["FIBER NEW ON MIGRATION"] += item.count;
        break;
      case "FTTH_REC_31K - AB-FTTH - CREATE-RECON":
        aggregatedCounts["FIBER RECON"] += item.count;
        break;
      case "Other - AB-CAB - CREATE":
        aggregatedCounts["COPPER NEW"] += item.count;
        break;
      case "Other - AB-CAB - CREATE-RECON":
        aggregatedCounts["COPPER RECON"] += item.count;
        break;
      default:
        break;
    }
  });
  const months = [
    "January", "February", "March", "April", "May",
    "June", "July", "August", "September", "October",
    "November", "December",
  ];
  
  // Prepare data for line charts
  const monthlyData = months.map((monthName, index) => {
    const monthData = counts.filter((item) => item.month === index + 1); // Filter for each month
    const monthlyAggregatedCounts = {
      fiberNewAccess: 0,
      peoTVFiberAccess: 0,
      fiberMigration: 0,
      peoTVMigration: 0,
      fiberRecon: 0,
      peoTVFiberRecon: 0,
      copperNew: 0,
      peoTVCopperAccess: 0,
      copperRecon: 0,
      peoTVCopperRecon: 0,
    };
  
    monthData.forEach((item) => {
      const combinedKey = `${item.category} - ${item.serviceType} - ${item.orderType}`;
      switch (combinedKey) {
        case "FTTH_NEW_132K - AB-FTTH - CREATE":
          monthlyAggregatedCounts.fiberNewAccess += item.count;
          break;
        case "PEO_NEW_53K - E-IPTV FTTH - CREATE":
          monthlyAggregatedCounts.peoTVFiberAccess += item.count;
          break;
        case "PEO_NEW_53K - E-IPTV FTTH - CREATE-UPGRD SAME NO":
          monthlyAggregatedCounts.peoTVMigration += item.count;
          break;
        case "FTTH_NEW_132K - AB-FTTH - CREATE-UPGRD SAME NO":
          monthlyAggregatedCounts.fiberMigration += item.count;
          break;
        case "FTTH_REC_31K - AB-FTTH - CREATE-RECON":
          monthlyAggregatedCounts.fiberRecon += item.count;
          break;
        case "PEO_REC_6K - E-IPTV FTTH - CREATE-RECON":
          monthlyAggregatedCounts.peoTVFiberRecon += item.count;
          break;
        case "Other - AB-CAB - CREATE":
          monthlyAggregatedCounts.copperNew += item.count;
          break;
        case "PEO_NEW_53K - E-IPTV COPPER - CREATE":
          monthlyAggregatedCounts.peoTVCopperAccess += item.count;
          break;
        case "Other - AB-CAB - CREATE-RECON":
          monthlyAggregatedCounts.copperRecon += item.count;
          break;
        case "PEO_REC_6K - E-IPTV COPPER - CREATE-RECON":
          monthlyAggregatedCounts.peoTVCopperRecon += item.count;
          break;
        default:
          break;
      }
    });
  
    // Calculate percentages for each month
    return {
      month: monthName,
      fiberNewPercentage: monthlyAggregatedCounts.fiberNewAccess > 0
        ? ((monthlyAggregatedCounts.peoTVFiberAccess / monthlyAggregatedCounts.fiberNewAccess) * 100).toFixed(2)
        : 0,
      fiberReconPercentage: monthlyAggregatedCounts.fiberRecon > 0
        ? ((monthlyAggregatedCounts.peoTVFiberRecon / monthlyAggregatedCounts.fiberRecon) * 100).toFixed(2)
        : 0,
        fiberMigrationPercentage:
        monthlyAggregatedCounts.fiberMigration > 0
          ? ((monthlyAggregatedCounts.peoTVMigration / monthlyAggregatedCounts.fiberMigration) * 100).toFixed(2)
          : 0,
      copperNewPercentage: monthlyAggregatedCounts.copperNew > 0
        ? ((monthlyAggregatedCounts.peoTVCopperAccess / monthlyAggregatedCounts.copperNew) * 100).toFixed(2)
        : 0,
      copperReconPercentage: monthlyAggregatedCounts.copperRecon > 0
        ? ((monthlyAggregatedCounts.peoTVCopperRecon / monthlyAggregatedCounts.copperRecon) * 100).toFixed(2)
        : 0,
    };
  });
  // Percentage calculations as per your formula
  const fiberNewAccessPercentage =
    aggregatedCounts["FIBER NEW ACCESS BAERER"] > 0
      ? ((aggregatedCounts["PEO TV NEW ACCESS BAERER (FIBER)"] /
          aggregatedCounts["FIBER NEW ACCESS BAERER"]) *
          100).toFixed(2)
      : 0;

  const copperNewPercentage =
    aggregatedCounts["COPPER NEW"] > 0
      ? ((aggregatedCounts["PEO TV NEW ACCESS BAERER (COPPER)"] /
          aggregatedCounts["COPPER NEW"]) *
          100).toFixed(2)
      : 0;

  const fiberMigrationPercentage =
    aggregatedCounts["FIBER NEW ON MIGRATION"] > 0
      ? ((aggregatedCounts["PEO TV NEW ON MIGRATION"] /
          aggregatedCounts["FIBER NEW ON MIGRATION"]) *
          100).toFixed(2)
      : 0;

  const fiberReconPercentage =
    aggregatedCounts["FIBER RECON"] > 0
      ? ((aggregatedCounts["PEO TV RECON (FIBER)"] /
          aggregatedCounts["FIBER RECON"]) *
          100).toFixed(2)
      : 0;

  const copperReconPercentage =
    aggregatedCounts["COPPER RECON"] > 0
      ? ((aggregatedCounts["PEO TV RECON (COPPER)"] /
          aggregatedCounts["COPPER RECON"]) *
          100).toFixed(2)
      : 0;
// Custom Legend Renderer as Buttons
const CustomLegend = ({ payload }) => (
  <Box sx={{ display: "flex", justifyContent: "center", gap: 2, flexWrap: "wrap" }}>
    {payload.map((entry) => (
      <button
        key={entry.dataKey}
        onClick={() => handleLegendClick({ dataKey: entry.dataKey })}
        style={{
          backgroundColor: lineVisibility[entry.dataKey] ? entry.color : "#ccc",
          color: "white",
          padding: "8px 16px",
          borderRadius: "20px",
          border: "none",
          cursor: "pointer",
          fontSize: "14px",
          fontWeight: "bold",
          boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.3)",
          transition: "background-color 0.3s ease",
        }}
      >
        {entry.value.toUpperCase()}
      </button>
    ))}
  </Box>
);
  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: `url(/BG.jpg)`, // Background image from public folder
        backgroundSize: "cover",
        backgroundPosition: "center",
        padding: 4,
        background: `url(/BG.jpg), linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.7))`, // Darker gradient to make background more dim
      }}
    >
      <Typography
        variant="h3"
        gutterBottom
        sx={{
          textAlign: "center",
          color: "#fff",
          fontWeight: "bold",
          textShadow: "2px 2px 4px rgba(0, 0, 0, 0.7)",
        }}
      >
        Fiber & Copper Statistics
      </Typography>
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          {/* Fiber Statistics Section (Blue Gradient) */}
          <Grid item xs={12}>
            <Typography variant="h5" sx={{ color: "#FFFFFF", fontWeight: "bold", marginBottom: 2 }}>
              Fiber Statistics
            </Typography>
          </Grid>
          {[
            { label: "NEW FTTH", percentage: fiberNewAccessPercentage, color: "linear-gradient(145deg, #0A237D, #0D47A1)" },
            { label: "MIGRATION", percentage: fiberMigrationPercentage, color: "linear-gradient(145deg, #0A237D, #0D47A1)" },
            { label: "RECON FTTH", percentage: fiberReconPercentage, color: "linear-gradient(145deg, #0A237D, #0D47A1)" },
          ].map((item, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Card
                sx={{
                  padding: 3,
                  background: item.color,
                  color: "#fff",
                  borderRadius: 2,
                  boxShadow: "0px 4px 15px rgba(0, 0, 0, 0.2)",
                  transition: "transform 0.3s ease",
                  "&:hover": { transform: "scale(1.05)" },
                }}
              >
                <Typography variant="h6" sx={{ fontWeight: "bold", marginBottom: 2 }}>
                  {item.label}
                </Typography>
                <Typography variant="h4">{item.percentage}%</Typography>
              </Card>
            </Grid>
          ))}

          {/* Copper Statistics Section (Green Gradient) */}
          <Grid item xs={12}>
            <Typography variant="h5" sx={{ color: "#FFFFFF", fontWeight: "bold", marginBottom: 2 }}>
              Copper Statistics
            </Typography>
          </Grid>
          {[
            { label: "NEW COPPER", percentage: copperNewPercentage, color: "linear-gradient(145deg, #1B5E20, #388E3C)" },
            { label: "RECON COPPER", percentage: copperReconPercentage, color: "linear-gradient(145deg, #1B5E20, #388E3C)" },
          ].map((item, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Card
                sx={{
                  padding: 3,
                  background: item.color,
                  color: "#fff",
                  borderRadius: 2,
                  boxShadow: "0px 4px 15px rgba(0, 0, 0, 0.2)",
                  transition: "transform 0.3s ease",
                  "&:hover": { transform: "scale(1.05)" },
                }}
              >
                <Typography variant="h6" sx={{ fontWeight: "bold", marginBottom: 2 }}>
                  {item.label}
                </Typography>
                <Typography variant="h4">{item.percentage}%</Typography>
              </Card>
            </Grid>
          ))}

          {/* Month Selector */}
          <Grid item xs={12}>
            <Card sx={{ padding: 3, background: "linear-gradient(to right, #2C3E50, #4CA1AF)", borderRadius: 3, boxShadow: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: "bold", marginBottom: 2, color: "#fff" }}>
                Select Month
              </Typography>
              <FormControl fullWidth>
                <InputLabel sx={{ color: "#fff" }}>Select Month</InputLabel>
                <Select
                  value={selectedMonth}
                  onChange={handleMonthSelect}
                  sx={{ color: "#fff", backgroundColor: "rgba(255,255,255,0.2)" }}
                >
                  <MenuItem value="all">All Months</MenuItem>
                  {[...Array(12)].map((_, i) => (
                    <MenuItem key={i + 1} value={i + 1}>
                      {new Date(0, i).toLocaleString("en", { month: "long" })}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Card>
          </Grid>
        </Grid>
      </Container>
      <Grid container spacing={4} sx={{ marginTop: 4 }}>
      <Grid container spacing={4} sx={{ marginTop: 4 }}>
  {/* Fiber Line Chart */}
  <Grid item xs={12} md={6}>
    <Box
      sx={{
        background: "rgba(30, 30, 50, 0.9)",
        borderRadius: 3,
        padding: 3,
        boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.4)",
      }}
    >
      <Typography variant="h5" sx={{ color: "#FFFFFF", fontWeight: "bold", marginBottom: 2 }}>
        Fiber Data Trend (Monthly)
      </Typography>
      <ResponsiveContainer width="100%" height={400}>
        <LineChart
          data={monthlyData}
          margin={{ top: 20, right: 30, left: 0, bottom: 10 }}
          syncId="lineGraphSync"
        >
          <defs>
            <linearGradient id="fiberNewGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#0077b6" stopOpacity={0.9} />
              <stop offset="100%" stopColor="#90e0ef" stopOpacity={0.3} />
            </linearGradient>
            <linearGradient id="fiberReconGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#4caf50" stopOpacity={0.9} />
              <stop offset="100%" stopColor="#4caf50" stopOpacity={0.3} />
            </linearGradient>
            <linearGradient id="fiberMigrationGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#ff8a9c" stopOpacity={0.9} />
              <stop offset="100%" stopColor="#ff8a9c" stopOpacity={0.3} />
            </linearGradient>
          </defs>

          {/* Remove grid lines */}
          <XAxis
            dataKey="month"
            tick={{ fill: "#fff" }}
            interval={0} // Show all months
            angle={-30}
            height={60}
            padding={{ left: 10, right: 10 }}
          />
          <YAxis
            tick={{ fill: "#fff" }}
            width={50}
            label={{ value: "Percentage (%)", angle: -90, position: "insideLeft", fill: "#fff" }}
          />
          <Tooltip
            contentStyle={{ backgroundColor: "#0a1f44", color: "#fff", borderRadius: 8 }}
            formatter={(value, name) => [`${value}%`, `${name}`]}
            cursor={{ stroke: "#ddd", strokeWidth: 1 }}
          />
    <Legend
  content={<CustomLegend />}
  layout="horizontal"
  align="center"
  verticalAlign="bottom"
/>

            {/* Conditional rendering of lines */}
            {lineVisibility.fiberNewPercentage && (
                <Line
                  type="monotoneX"
                  dataKey="fiberNewPercentage"
                  name="New Access Bearer FTTH %"
                  stroke="#0077b6"
                  strokeWidth={3}
                  dot={{ stroke: "#0077b6", fill: "#0077b6", strokeWidth: 2, r: 5 }}
                  activeDot={{ r: 8 }}
                  animationDuration={1000}
                />
              )}
              {lineVisibility.fiberReconPercentage && (
                <Line
                  type="monotoneX"
                  dataKey="fiberReconPercentage"
                  name="Recon FTTH %"
                  stroke="#4caf50"
                  strokeWidth={3}
                  dot={{ stroke: "#4caf50", fill: "#4caf50", strokeWidth: 2, r: 5 }}
                  activeDot={{ r: 8 }}
                  animationDuration={1200}
                />
              )}
              {lineVisibility.fiberMigrationPercentage && (
                <Line
                  type="monotoneX"
                  dataKey="fiberMigrationPercentage"
                  name="Migration FTTH %"
                  stroke="#ff5c6f"
                  strokeWidth={3}
                  dot={{ stroke: "#ff5c6f", fill: "#ff5c6f", strokeWidth: 2, r: 5 }}
                  activeDot={{ r: 8 }}
                  animationDuration={1400}
                />
              )}
        </LineChart>
      </ResponsiveContainer>
    </Box>
  </Grid>

  {/* Copper Line Chart */}
  <Grid item xs={12} md={6}>
    <Box
      sx={{
        background: "rgba(30, 30, 50, 0.9)",
        borderRadius: 3,
        padding: 3,
        boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.4)",
      }}
    >
      <Typography variant="h5" sx={{ color: "#FFFFFF", fontWeight: "bold", marginBottom: 2 }}>
        Copper Data Trend (Monthly)
      </Typography>
      <ResponsiveContainer width="100%" height={400}>
        <LineChart
          data={monthlyData}
          margin={{ top: 20, right: 30, left: 0, bottom: 10 }}
          syncId="lineGraphSync"
        >
          <defs>
            <linearGradient id="copperNewGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#0077b6" stopOpacity={0.9} />
              <stop offset="100%" stopColor="#0077b6" stopOpacity={0.3} />
            </linearGradient>
            <linearGradient id="copperReconGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#4caf50" stopOpacity={0.9} />
              <stop offset="100%" stopColor="#4caf50" stopOpacity={0.3} />
            </linearGradient>
          </defs>

          <XAxis
            dataKey="month"
            tick={{ fill: "#fff" }}
            interval={0}
            angle={-30}
            height={60}
            padding={{ left: 10, right: 10 }}
          />
          <YAxis
            tick={{ fill: "#fff" }}
            width={50}
            label={{ value: "Percentage (%)", angle: -90, position: "insideLeft", fill: "#fff" }}
          />
          <Tooltip
            contentStyle={{ backgroundColor: "#0a1f44", color: "#fff", borderRadius: 8 }}
            formatter={(value, name) => [`${value}%`, `${name}`]}
            cursor={{ stroke: "#ddd", strokeWidth: 1 }}
          />
       <Legend
  content={<CustomLegend />}
  layout="horizontal"
  align="center"
  verticalAlign="bottom"
/>

{lineVisibility.copperNewPercentage && (
                <Line
                  type="monotoneX"
                  dataKey="copperNewPercentage"
                  name="New Copper %"
                  stroke="#0077b6"
                  strokeWidth={3}
                  dot={{ stroke: "#0077b6", fill: "#0077b6", strokeWidth: 2, r: 5 }}
                  activeDot={{ r: 8 }}
                  animationDuration={1000}
                />
              )}
              {lineVisibility.copperReconPercentage && (
                <Line
                  type="monotoneX"
                  dataKey="copperReconPercentage"
                  name="Recon Copper %"
                  stroke="#4caf50"
                  strokeWidth={3}
                  dot={{ stroke: "#4caf50", fill: "#4caf50", strokeWidth: 2, r: 5 }}
                  activeDot={{ r: 8 }}
                  animationDuration={1200}
                />
              )}
        </LineChart>
      </ResponsiveContainer>
    </Box>
  </Grid>

  {/* Reset Button */}
  <Grid item xs={12} sx={{ textAlign: "center", marginTop: 2 }}>
  <button
    onClick={resetAllLines} // Reset line visibility when clicked
    style={{
      backgroundColor: "#1e90ff",
      color: "white",
      padding: "12px 24px",
      borderRadius: "8px",
      border: "none",
      fontSize: "16px",
      cursor: "pointer",
      boxShadow: "0px 4px 15px rgba(0, 0, 0, 0.3)",
    }}
  >
    Reset All Lines
  </button>
</Grid>
</Grid>
</Grid>
    </Box>
  );
};

export default FiberStatisticsPage;
