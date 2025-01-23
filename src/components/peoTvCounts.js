import React, { useEffect, useState } from "react";
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
} from "@mui/material";
import { ExpandMore, ExpandLess } from "@mui/icons-material";
import { getPeoTvCounts } from "../services/api";
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

const PeoTvCounts = () => {
  const [counts, setCounts] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showDetails, setShowDetails] = useState(false);

  // Filters
  const [selectedYear, setSelectedYear] = useState(""); // Single-select
  const [selectedMonths, setSelectedMonths] = useState([]); // Multi-select
  const [selectedDays, setSelectedDays] = useState([]); // Multi-select
  const [selectedRtoAreas, setSelectedRtoAreas] = useState([]); // Multi-select
  const [selectedDeletedMethod, setSelectedDeletedMethod] = useState(""); // Single-select
  const [selectedDurations, setSelectedDurations] = useState([]); // Multi-select
  const [selectedDgms, setSelectedDgms] = useState([]); // Multi-select
  const [selectedGms, setSelectedGms] = useState([]); // Multi-select

  // Dropdown options
  const years = [2023, 2024];
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
  const rtoAreas = ["RTO - AD", "RTO - AG", "RTO - AP", "RTO - BC", "RTO - BD"];
  const deletedMethods = ["Customer Requested", "Non Payment"];
  const durations = ["below 1 year", "1 year to 2 years", "2 years to 3 years", "3 years to 4 years", "4 years to 5 years", "more than 5 years"];
  const dgms = ["NP", "WPS", "EP", "SAB-UVA"];
  const gms = ["REGION 1", "REGION 2", "REGION 3", "METRO"];

  const fetchData = async () => {
    try {
      setLoading(true);
      const params = {
        year: selectedYear || undefined,
        month: selectedMonths.length > 0 ? selectedMonths.join(",") : undefined,
        day: selectedDays.length > 0 ? selectedDays.join(",") : undefined,
        order_line_rto_area: selectedRtoAreas.length > 0 ? selectedRtoAreas.join(",") : undefined,
        deleted_method: selectedDeletedMethod || undefined,
        duration: selectedDurations.length > 0 ? selectedDurations.join(",") : undefined,
        dgm: selectedDgms.length > 0 ? selectedDgms.join(",") : undefined,
        gm: selectedGms.length > 0 ? selectedGms.join(",") : undefined,
      };
      const queryString = Object.keys(params)
        .filter((key) => params[key] !== undefined)
        .map((key) => `${key}=${params[key]}`)
        .join("&");

      const data = await getPeoTvCounts(queryString ? `?${queryString}` : "");
      setCounts(data);
    } catch (error) {
      console.error("Error fetching PEO TV counts:", error.message);
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

  const filteredMonths = selectedMonths.length > 0 ? selectedMonths : months.map((m) => m.value);

  const monthlyCounts = counts
    ? {
        labels: months.filter((m) => filteredMonths.includes(m.value)).map((m) => m.name),
        datasets: [
          {
            label: "PEO TV WITH COPPER",
            data: filteredMonths.map(() => counts.total_peotv_with_copper / filteredMonths.length),
            borderColor: "#5cb85c",
            backgroundColor: "rgba(92, 184, 92, 0.3)",
            tension: 0.4,
            pointRadius: 5,
            fill: true,
          },
          {
            label: "PEO TV WITH FIBER",
            data: filteredMonths.map(() => counts.total_peotv_with_fiber / filteredMonths.length),
            borderColor: "#0275d8",
            backgroundColor: "rgba(2, 117, 216, 0.3)",
            tension: 0.4,
            pointRadius: 5,
            fill: true,
          },
          {
            label: "ONLY PEO TV",
            data: filteredMonths.map(() => counts.total_only_peotv / filteredMonths.length),
            borderColor: "#ff9800",
            backgroundColor: "rgba(255, 152, 0, 0.3)",
            tension: 0.4,
            pointRadius: 5,
            fill: true,
          },
        ],
      }
    : { labels: [], datasets: [] };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: `url(/BG.jpg)`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        padding: 4,
      }}
    >
      <Typography
        variant="h3"
        gutterBottom
        sx={{
          textAlign: "center",
          color: "#fff",
          fontWeight: "bold",
          textShadow: "2px 2px 4px rgba(0, 0, 0, 0.5)",
        }}
      >
        PEO TV Disconnection Dashboard
      </Typography>

      <Box
        sx={{
          backgroundColor: "#673AB7",
          color: "#fff",
          borderRadius: 4,
          padding: 3,
          marginY: 4,
          textAlign: "center",
          fontSize: "2rem",
          fontWeight: "bold",
          boxShadow: "0 0 20px rgba(103, 58, 183, 0.8)",
        }}
      >
        Total Disconnections: {totalDisconnections.toLocaleString()}
      </Box>

      <Container maxWidth="lg">
        <Box sx={{ marginBottom: 3 }}>
          <Typography variant="h5" sx={{ color: "#00c6ff", fontWeight: "bold", marginBottom: 2 }}>
            Filters
          </Typography>
          <Grid container spacing={2}>
            {[
              { label: "Year", value: selectedYear, options: years, onChange: setSelectedYear, multiple: false },
              { label: "Month", value: selectedMonths, options: months, onChange: setSelectedMonths, multiple: true },
              { label: "Day", value: selectedDays, options: days, onChange: setSelectedDays, multiple: true },
              { label: "RTO Area", value: selectedRtoAreas, options: rtoAreas, onChange: setSelectedRtoAreas, multiple: true },
              { label: "Deleted Method", value: selectedDeletedMethod, options: deletedMethods, onChange: setSelectedDeletedMethod, multiple: false },
              { label: "Duration", value: selectedDurations, options: durations, onChange: setSelectedDurations, multiple: true },
              { label: "DGM", value: selectedDgms, options: dgms, onChange: setSelectedDgms, multiple: true },
              { label: "GM", value: selectedGms, options: gms, onChange: setSelectedGms, multiple: true },
            ].map((filter, index) => (
              <Grid item xs={12} sm={6} md={3} key={index}>
                <Card sx={{ padding: 2, background: "rgba(255, 255, 255, 0.1)", boxShadow: 3, borderRadius: 2 }}>
                  <FormControl fullWidth>
                    <InputLabel sx={{ color: "#00c6ff", fontWeight: "bold" }}>{filter.label}</InputLabel>
                    <Select
                      multiple={filter.multiple}
                      value={filter.value}
                      onChange={(e) => {
                        filter.onChange(filter.multiple ? e.target.value : e.target.value); // Handle single vs multiple values
                      }}
                      sx={{
                        color: "#fff",
                        background: "rgba(0, 0, 0, 0.6)",
                        "& .MuiSelect-icon": { color: "#fff" },
                      }}
                      label={filter.label}
                      renderValue={(selected) =>
                        filter.multiple ? (
                          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                            {selected.map((value) => (
                              <Chip key={value} label={months.find((m) => m.value === value)?.name || value} color="primary" />
                            ))}
                          </Box>
                        ) : (
                          selected
                        )
                      }
                    >
                      {filter.options.map((option, idx) => (
                        <MenuItem value={option.value || option} key={idx}>
                          {option.name || option}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Card>
              </Grid>
            ))}
            <Grid item xs={12}>
              <Button
                variant="contained"
                sx={{
                  backgroundColor: "#00c6ff",
                  color: "#fff",
                  fontWeight: "bold",
                  marginTop: 2,
                  width: "100%",
                }}
                onClick={applyFilters}
              >
                Apply Filters
              </Button>
            </Grid>
          </Grid>
        </Box>

        <Button
          onClick={() => setShowDetails(!showDetails)}
          variant="contained"
          sx={{ backgroundColor: "#673AB7", marginBottom: 2 }}
          endIcon={showDetails ? <ExpandLess /> : <ExpandMore />}
        >
          {showDetails ? "Hide Breakdown" : "Show Breakdown"}
        </Button>
        <Collapse in={showDetails}>
          <Grid container spacing={2} sx={{ marginTop: 3 }}>
            {counts &&
              Object.keys(counts)
                .filter((key) => key !== "total")
                .map((key, idx) => (
                  <Grid item xs={12} sm={6} md={4} key={idx}>
                    <Card
                      sx={{
                        padding: 3,
                        backgroundColor: key === "total" ? "#673AB7" : "#1B5E20",
                        color: "#fff",
                        borderRadius: 2,
                        boxShadow: 3,
                        textAlign: "center",
                      }}
                    >
                      <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                        {key.replace(/_/g, " ").toUpperCase()}
                      </Typography>
                      <Typography variant="h4">{counts[key].toLocaleString() || 0}</Typography>
                    </Card>
                  </Grid>
                ))}
          </Grid>
        </Collapse>

        <Box sx={{ marginY: 4 }}>
          <Typography variant="h5" sx={{ color: "#fff", marginBottom: 2 }}>
            Disconnections Pattern (Line Chart)
          </Typography>
          {loading ? (
            <Box sx={{ display: "flex", justifyContent: "center" }}>
              <CircularProgress color="secondary" />
            </Box>
          ) : (
            <Line
              data={monthlyCounts}
              options={{
                responsive: true,
                plugins: {
                  legend: { display: true },
                },
                scales: {
                  x: { ticks: { color: "#fff" } },
                  y: { ticks: { color: "#fff", beginAtZero: true } },
                },
              }}
            />
          )}
        </Box>
      </Container>
    </Box>
  );
};

export default PeoTvCounts;