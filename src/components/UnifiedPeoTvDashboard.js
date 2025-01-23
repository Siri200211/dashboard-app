import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Box,
  Typography,
  CircularProgress,
  Container,
  Grid,
  Card,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Collapse,
  Chip,
  Autocomplete,
  TextField,
} from "@mui/material";

import { ExpandMore, ExpandLess } from "@mui/icons-material";
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, Title, Tooltip, Legend, Filler);

const UnifiedPeoTvDashboard = () => {
  const [counts, setCounts] = useState(null);
  const [chartData, setChartData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showDetails, setShowDetails] = useState(false);

  // Filters
  const [selectedYear, setSelectedYear] = useState(""); 
  const [selectedMonths, setSelectedMonths] = useState([]);
  const [selectedDays, setSelectedDays] = useState([]);
  const [selectedRtoAreas, setSelectedRtoAreas] = useState([]);
  const [selectedDeletedMethod, setSelectedDeletedMethod] = useState("");
  const [selectedDurations, setSelectedDurations] = useState([]);
  const [selectedDgms, setSelectedDgms] = useState([]);
  const [selectedGms, setSelectedGms] = useState([]);

  // Dropdown options
  const years = [2023, 2024, 2025];
  const months = [
    { name: "January", value: 1 },
    { name: "February", value: 2 },
    { name: "March", value: 3 },
    { name: "April", value: 4 },
    { name: "May", value: 5 },
    { name: "June", value: 6 },
    { name: "July", value: 7 },
    { name: "August", value: 8 },
    { name: "September", value: 9 },
    { name: "October", value: 10 },
    { name: "November", value: 11 },
    { name: "December", value: 12 },
  ];
  const days = Array.from({ length: 31 }, (_, i) => i + 1);
  const rtoAreas = [
    "RTO - AD",
    "RTO - AG",
    "RTO - AP",
    "RTO - BC",
    "RTO - BD",
    "RTO - BW",
    "RTO - CW",
    "RTO - GL",
    "RTO - GP",
    "RTO - GQ",
    "RTO - HB",
    "RTO - HK",
    "RTO - HO",
    "RTO - HR",
    "RTO - HT",
    "RTO - JA",
    "RTO - KE",
    "RTO - KG",
    "RTO - KI",
    "RTO - KL",
    "RTO - KLY",
    "RTO - KO",
    "RTO - KON",
    "RTO - KT",
    "RTO - KX",
    "RTO - KY",
    "RTO - MB",
    "RTO - MD",
    "RTO - MH",
    "RTO - MLT",
    "RTO - MRG",
    "RTO - MT",
    "RTO - ND",
    "RTO - NG",
    "RTO - NTB",
    "RTO - NW",
    "RTO - PH",
    "RTO - PR",
    "RTO - RM",
    "RTO - RN",
    "RTO - TC",
    "RTO - VA",
    "RTO - WT",
  ];
  const deletedMethods = ["All","Customer Requested", "Non Payment"];
  const durations = ["below 1 year", "1 year to 2 years", "2 years to 3 years", "3 years to 4 years", "4 years to 5 years", "more than 5 years"];
  const dgms = ["NP", "WPS", "EP", "SAB-UVA", "CP", "SP", "WPN", "NWP","METRO 1","METRO 2"];
  const gms = ["REGION 1", "REGION 2", "REGION 3", "METRO"];
  const exportChartData = () => {
    if (!chartData || !chartData.datasets || chartData.datasets.length === 0) {
      alert("No data available for export.");
      return;
    }
  
    // Create filter metadata
    const appliedFilters = {
      Year: selectedYear.join(", ") || "All",
      Month:
        selectedMonths.length > 0
          ? selectedMonths.map((month) => month.name || month).join(", ")
          : "All",
      Day: selectedDays.length > 0 ? selectedDays.join(", ") : "All",
      "RTO Areas": selectedRtoAreas.join(", ") || "All",
      "Deleted Method": selectedDeletedMethod || "All",
      Duration: selectedDurations.join(", ") || "All",
      DGM: selectedDgms.join(", ") || "All",
      GM: selectedGms.join(", ") || "All",
    };
  
    // Build CSV content
    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += "Filters Applied:\n";
    Object.entries(appliedFilters).forEach(([key, value]) => {
      csvContent += `${key}: ${value}\n`;
    });
    csvContent += "\n";
  
    // Check if single year or multiple years selected
    if (selectedYear.length === 1) {
      // Single year: Show monthly breakdown
      csvContent += "Month,Copper,Fiber,Only PEO TV\n";
      const months = chartData.labels;
      const datasets = chartData.datasets;
  
      months.forEach((month, i) => {
        const row = [
          month,
          datasets[0]?.data[i] || 0,
          datasets[1]?.data[i] || 0,
          datasets[2]?.data[i] || 0,
        ];
        csvContent += row.join(",") + "\n";
      });
    } else {
      // Multiple years: Aggregate data by year
      csvContent += "Year,Copper,Fiber,Only PEO TV\n";
      selectedYear.forEach((year) => {
        const yearData = chartData.datasets
          .filter((dataset) => dataset.label.includes(`(${year})`))
          .map((dataset) => dataset.data.reduce((sum, value) => sum + (value || 0), 0));
  
        const row = [year, yearData[0] || 0, yearData[1] || 0, yearData[2] || 0];
        csvContent += row.join(",") + "\n";
      });
    }
  
    // Trigger download
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "disconnection_data.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  const fetchData = async () => {
    try {
      setLoading(true);

      // Params for API calls
      const selectedMonthValues = selectedMonths.map((month) => (typeof month === 'object' ? month.value : month));
      const params = {
        year: selectedYear.length > 0 ? selectedYear.join(",") : undefined,
        month: selectedMonthValues.length > 0 ? selectedMonthValues.join(",") : undefined, // Updated logic
        day: selectedDays.length > 0 ? selectedDays.join(",") : undefined,
        order_line_rto_area: selectedRtoAreas.length > 0 ? selectedRtoAreas.join(",") : undefined,
        deleted_method: selectedDeletedMethod !== "All" ? selectedDeletedMethod : undefined,
        duration: selectedDurations.length > 0 ? selectedDurations.join(",") : undefined,
        dgm: selectedDgms.length > 0 ? selectedDgms.join(",") : undefined,
        gm: selectedGms.length > 0 ? selectedGms.join(",") : undefined,
      };
      // Fetching counts data
      const countsResponse = await axios.get("http://localhost:8070/disconnection-counts", { params });
      setCounts(countsResponse.data);

      // Fetching monthly data for line chart
      const monthlyResponse = await axios.get("http://localhost:8070/monthlyCounts", { params });
      if (monthlyResponse.data?.monthlyCounts?.length) {
        const groupedData = {};
        monthlyResponse.data.monthlyCounts.forEach((item) => {
          const { year, month, total_peotv_with_copper, total_peotv_with_fiber, total_only_peotv } = item;
      
          if (!groupedData[year]) {
            groupedData[year] = {
              copper: Array(12).fill(0),
              fiber: Array(12).fill(0),
              onlyPeotv: Array(12).fill(0),
            };
          }
      
          groupedData[year].copper[month - 1] = total_peotv_with_copper || 0;
          groupedData[year].fiber[month - 1] = total_peotv_with_fiber || 0;
          groupedData[year].onlyPeotv[month - 1] = total_only_peotv || 0;
        });
      
        setChartData({
          labels: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
          datasets: Object.entries(groupedData).flatMap(([year, data]) => [
            {
              label: `Copper (${year})`,
              data: data.copper,
              borderColor: "#4caf50",
              backgroundColor: "rgba(76, 175, 80, 0.2)",
              pointBackgroundColor: "#4caf50",
              pointRadius: 6,
              hoverRadius: 8,
              borderWidth: 2,
              tension: 0.3,
              fill: true,
            },
            {
              label: `Fiber (${year})`,
              data: data.fiber,
              borderColor: "#2196f3",
              backgroundColor: "rgba(33, 150, 243, 0.2)",
              pointBackgroundColor: "#2196f3",
              pointRadius: 6,
              hoverRadius: 8,
              borderWidth: 2,
              tension: 0.3,
              fill: true,
            },
            {
              label: `Only PEO TV (${year})`,
              data: data.onlyPeotv,
              borderColor: "#ff9800",
              backgroundColor: "rgba(255, 152, 0, 0.2)",
              pointBackgroundColor: "#ff9800",
              pointRadius: 6,
              hoverRadius: 8,
              borderWidth: 2,
              tension: 0.3,
              fill: true,
            },
          ]),
        });
      } else {
        setChartData({
          labels: [],
          datasets: [],
        });
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const applyFilters = () => {
    fetchData();
  };

  const totalDisconnections = counts
    ? (counts.total_peotv_with_copper || 0) + (counts.total_peotv_with_fiber || 0) + (counts.total_only_peotv || 0)
    : 0;

  return (
    <Box
    sx={{
      minHeight: '100vh',
      background: `url(/BG.jpg) no-repeat center center fixed, linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.8))`,
      backgroundSize: 'cover',
      padding: 4,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      color: '#fff',
      textAlign: 'center',
      overflow: 'hidden',
      animation: 'fadeIn 2s ease-in-out', // Added fade-in effect to the page
    }}
  >
    <Typography
      variant="h3"
      sx={{
        textAlign: "center",
        color: "#fff",
        fontWeight: "bold",
        mb: 3,
        textShadow: "2px 2px 10px rgba(0, 0, 0, 0.5)",
      }}
    >
      📊 PEOTV Disconnection Dashboard
    </Typography>
  
    <Container maxWidth="lg">
      {/* Total Disconnections */}
      <Box
  sx={{
    background: "linear-gradient(135deg, #3f51b5, #1a237e)",
    color: "#fff",
    borderRadius: 4,
    p: 3,
    textAlign: "center",
    fontWeight: "bold",
    mb: 4,
    boxShadow: "0px 10px 20px rgba(0, 0, 0, 0.2)",
    fontSize: "1.5rem", // Change to your preferred size
  }}
>
  TOTAL DISCONNECTIONS: {totalDisconnections.toLocaleString()}
</Box>
      <Grid container spacing={2} sx={{ mb: 3 }}>
        {/* Filters */}
        {[
          { label: "Year", value: selectedYear, options: years, onChange: setSelectedYear, multiple: true,  placeholder: "Select Year(s)"},
          { label: "Month", value: selectedMonths, options: months, onChange: setSelectedMonths, multiple: true, placeholder: "Select Month" },
          { label: "Day", value: selectedDays, options: days, onChange: setSelectedDays, multiple: true, placeholder: "Select Day" },
          { label: "RTO Area", value: selectedRtoAreas, options: rtoAreas, onChange: setSelectedRtoAreas, multiple: true, placeholder: "Select RTO Area" },
          { label: "Deleted Method", value: selectedDeletedMethod, options: deletedMethods, onChange: setSelectedDeletedMethod, multiple: false, placeholder: "Select Deleted Method" },
          { label: "Duration", value: selectedDurations, options: durations, onChange: setSelectedDurations, multiple: true, placeholder: "Select Duration" },
          { label: "DGM", value: selectedDgms, options: dgms, onChange: setSelectedDgms, multiple: true, placeholder: "Select DGM" },
          { label: "GM", value: selectedGms, options: gms, onChange: setSelectedGms, multiple: true, placeholder: "Select GM" },
        ].map((filter, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Card
              sx={{
                padding: 2,
                background: "linear-gradient(135deg, #2e3b55, #1e2a3a)",
                color: "#fff",
                borderRadius: 3,
                boxShadow: "0px 8px 16px rgba(0, 0, 0, 0.4)",
                "&:hover": {
                  background: "linear-gradient(135deg, #394867, #222d3f)",
                  boxShadow: "0px 12px 24px rgba(0, 0, 0, 0.5)",
                },
              }}
            >
              <FormControl fullWidth>
              <Autocomplete
  multiple={filter.multiple} // Enable multiple for "Year" only
  options={filter.options} // Options array
  getOptionLabel={(option) =>
    typeof option === "object" ? option.name : option.toString()
  } // Handle object or primitive options
  value={
    filter.multiple
      ? Array.isArray(filter.value)
        ? filter.value
        : []
      : filter.value || "" // Ensure value is correct for single/multiple
  }
  onChange={(event, newValue) =>
    filter.onChange(filter.multiple ? newValue : newValue || "") // Handle single or multiple values
  }
  renderTags={(value, getTagProps) =>
    filter.multiple
      ? value.map((option, index) => (
          <Chip
            key={index}
            label={typeof option === "object" ? option.name : option}
            {...getTagProps({ index })}
            sx={{
              backgroundColor: "#64b5f6",
              color: "#0d47a1",
              fontWeight: "bold",
              margin: "2px",
            }}
          />
        ))
      : null // No tags for single-selection filters
  }
  renderInput={(params) => (
    <TextField
      {...params}
      variant="outlined"
      placeholder={filter.placeholder || "Select Option"}
      sx={{
        backgroundColor: "#2c2f36",
        borderRadius: 1,
        "& .MuiOutlinedInput-root": { borderColor: "#64b5f6" },
        "& .MuiOutlinedInput-input": { color: "#fff" },
        "& .MuiInputLabel-root": { color: "#bbdefb" },
      }}
    />
  )}
/>
              </FormControl>
            </Card>
          </Grid>
        ))}
  
        <Grid item xs={12}>
          <Button
            variant="contained"
            fullWidth
            sx={{
              mt: 2,
              background: "linear-gradient(135deg, #1e88e5, #1565c0)",
              fontWeight: "bold",
              "&:hover": { background: "linear-gradient(135deg, #0d47a1, #003c8f)" },
            }}
            onClick={applyFilters}
          >
            Apply Filters
          </Button>
          <Button
    variant="outlined"
    fullWidth
    sx={{
      mt: 1,
      fontWeight: "bold",
      color: "#ff6b6b",
      borderColor: "#ff6b6b",
      "&:hover": {
        backgroundColor: "#ffebee",
        borderColor: "#ff6b6b",
      },
    }}
    onClick={() => {
      // Reset all filter states
      setSelectedYear(""); // Or use "" if preferred // Reset to current year
      setSelectedMonths([]);
      setSelectedDays([]);
      setSelectedRtoAreas([]);
      setSelectedDeletedMethod(""); // Reset single selection
      setSelectedDurations([]);
      setSelectedDgms([]);
      setSelectedGms([]);
    }}
  >
    Reset All Filters
  </Button>
        </Grid>
      </Grid>

      {/* Count Cards Section */}
      <Grid container spacing={2} sx={{ marginTop: 3 }}>
        {counts &&
          Object.keys(counts)
            .filter((key) => key !== "total")
            .map((key, idx) => (
              <Grid item xs={12} sm={6} md={4} key={idx}>
                <Card
                  sx={{
                    padding: 3,
                    backgroundColor: key.includes("copper")
                      ? "#4caf50"
                      : key.includes("fiber")
                      ? "#2196f3"
                      : "#ff9800",
                    color: "#fff",
                    borderRadius: 2,
                    boxShadow: 3,
                    textAlign: "center",
                  }}
                >
                  <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                    {key.replace(/_/g, " ").toUpperCase()}
                  </Typography>
                  <Typography variant="h4">{counts[key].toLocaleString()}</Typography>
                </Card>
              </Grid>
            ))}
      </Grid>
      <Box>
  {/* Show/Hide Button */}
  <Button
    onClick={() => setShowDetails(!showDetails)}
    variant="contained"
    sx={{
      backgroundColor: "#3f51b5",
      mb: 2,
      width: "100%",
      fontWeight: "bold",
      "&:hover": { backgroundColor: "#2c3e50" },
    }}
    endIcon={showDetails ? <ExpandLess /> : <ExpandMore />}
  >
    {showDetails ? "Hide Line Chart" : "Show Line Chart"}
  </Button>

  {/* Line Chart Section */}
  <Collapse in={showDetails}>
  <Box
    sx={{
      padding: 4,
      borderRadius: 4,
      boxShadow: "0 8px 16px rgba(0, 0, 0, 0.6)",
      background: "linear-gradient(145deg, rgba(30, 31, 43, 0.85), rgba(21, 23, 29, 0.85))", // Transparent gradient
      mb: 4,
    }}
  >
    <Typography
      variant="h5"
      sx={{ color: "#fff", fontWeight: "bold", mb: 2, textAlign: "center" }}
    >
      Disconnections Trend (Line Chart)
    </Typography>

    {loading ? (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "400px",
        }}
      >
        <CircularProgress size={80} />
      </Box>
    ) : chartData && chartData.datasets && chartData.datasets.length > 0 ? (
      <Line
        data={{
          labels: chartData.labels || [],
          datasets: chartData.datasets.map((dataset, index) => ({
            ...dataset,
            data: dataset.data || [], // Ensure data array exists
          })),
        }}
        options={{
          responsive: true,
          plugins: {
            legend: {
              display: true,
              position: "bottom",
              labels: {
                color: "#ddd",
                font: { size: 16, weight: "bold" },
                usePointStyle: true,
                padding: 15,
              },
              onClick: (e, legendItem, chart) => {
                const index = legendItem.datasetIndex;
                const ci = chart.chart;
                const meta = ci.getDatasetMeta(index);

                // Toggle visibility
                meta.hidden = meta.hidden === null ? true : null;
                ci.update();
              },
            },
            tooltip: {
              backgroundColor: "#2c2f36",
              borderColor: "#444",
              borderWidth: 1,
              titleColor: "#fff",
              bodyColor: "#fff",
              cornerRadius: 10,
              padding: 12,
              usePointStyle: true,
              callbacks: {
                label: (context) => {
                  const value = context.raw || 0;
                  const previousValue =
                    context.dataset.data[context.dataIndex - 1] || value;
                  const percentageChange =
                    ((value - previousValue) / previousValue) * 100 || 0;
                  return ` ${context.dataset.label}: ${value.toLocaleString()} (${percentageChange.toFixed(
                    2
                  )}%)`;
                },
              },
            },
          },
          animation: {
            duration: 1000,
            easing: "easeInOutCubic",
          },
          interaction: {
            mode: "index",
            intersect: false,
          },
          scales: {
            x: {
              title: {
                display: true,
                text: "Months",
                color: "#bbb",
                font: { size: 16, weight: "bold" },
              },
              grid: {
                color: "rgba(255, 255, 255, 0.1)",
                lineWidth: 1,
                drawBorder: true,
                drawTicks: false,
              },
              ticks: {
                color: "#ddd",
                font: { size: 12 },
              },
            },
            y: {
              title: {
                display: true,
                text: "Number of Disconnections",
                color: "#bbb",
                font: { size: 16, weight: "bold" },
              },
              grid: {
                color: "rgba(255, 255, 255, 0.05)",
              },
              ticks: {
                beginAtZero: true,
                color: "#ddd",
                stepSize: 500,
              },
            },
          },
        }}
      />
    ) : (
      <Typography
        variant="body1"
        sx={{ textAlign: "center", mt: 4, color: "#bbb" }}
      >
        No data available for the selected filters.
      </Typography>
    )}
  </Box>
</Collapse>
</Box>
<Button
  variant="outlined"
  sx={{
    mt: 2,
    color: "#fff",
    borderColor: "#fff",
    "&:hover": { backgroundColor: "#2c2f36", borderColor: "#fff" },
  }}
  onClick={exportChartData}
>
  Export Data as CSV
</Button>
    </Container>
  </Box>
  );
};

export default UnifiedPeoTvDashboard;