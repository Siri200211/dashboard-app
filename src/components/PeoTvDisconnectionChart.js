import React, { useEffect, useState } from "react";
import axios from "axios";
import { Line } from "react-chartjs-2";
import {
  Box,
  CircularProgress,
  Typography,
  FormControl,
  MenuItem,
  Select,
  InputLabel,
  Card,
  Grid,
  Button,
} from "@mui/material";
import { styled } from "@mui/system";

import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Legend,
  Title,
  Tooltip,
} from "chart.js";

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, Legend, Title, Tooltip);

// Styled component for sleek chart card
const ChartContainer = styled(Card)({
  padding: "24px",
  borderRadius: "16px",
  backgroundColor: "#fff",
  boxShadow: "0px 4px 16px rgba(0, 0, 0, 0.1)",
});

const PeoTvDisconnectionChart = () => {
  const [chartData, setChartData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedRtoAreas, setSelectedRtoAreas] = useState([]);
  const [selectedDgms, setSelectedDgms] = useState([]);
  const [selectedGms, setSelectedGms] = useState([]);
  const [selectedDuration, setSelectedDuration] = useState([]);
  const [selectedDeletedMethod, setSelectedDeletedMethod] = useState("all");

  const years = [2023, 2024, 2025];
  const rtoAreas = ["RTO - AD", "RTO - AG", "RTO - AP", "RTO - BC", "RTO - BD"];
  const dgms = ["NP", "WPS", "EP", "SAB-UVA"];
  const gms = ["REGION 1", "REGION 2", "REGION 3", "METRO"];
  const durations = ["below 1 year", "1 year to 2 years", "2 years to 3 years", "more than 5 years"];
  const deletedMethods = ["Customer Requested", "Non Payment"];

  const fetchMonthlyData = async () => {
    try {
      setLoading(true);

      const response = await axios.get("http://localhost:8070/monthlyCounts", {
        params: {
          year: selectedYear,
          order_line_rto_area: selectedRtoAreas.length ? selectedRtoAreas.join(",") : undefined,
          dgm: selectedDgms.length ? selectedDgms.join(",") : undefined,
          gm: selectedGms.length ? selectedGms.join(",") : undefined,
          duration: selectedDuration.length ? selectedDuration.join(",") : undefined,
          deleted_method: selectedDeletedMethod !== "all" ? selectedDeletedMethod : undefined,
        },
      });
      const data = response.data.monthlyCounts;

      setChartData({
        labels: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
        datasets: [
          {
            label: "PEO TV WITH COPPER",
            data: data.map((item) => item.total_peotv_with_copper),
            borderColor: "#4caf50",
            backgroundColor: "rgba(76, 175, 80, 0.2)",
            pointBorderColor: "#388e3c",
            pointRadius: 6,
            hoverRadius: 8,
            borderWidth: 2,
            tension: 0.3,
            fill: true,
          },
          {
            label: "PEO TV WITH FIBER",
            data: data.map((item) => item.total_peotv_with_fiber),
            borderColor: "#2196f3",
            backgroundColor: "rgba(33, 150, 243, 0.2)",
            pointBorderColor: "#1976d2",
            pointRadius: 6,
            hoverRadius: 8,
            borderWidth: 2,
            tension: 0.3,
            fill: true,
          },
          {
            label: "ONLY PEO TV",
            data: data.map((item) => item.total_only_peotv),
            borderColor: "#ff9800",
            backgroundColor: "rgba(255, 152, 0, 0.2)",
            pointBorderColor: "#f57c00",
            pointRadius: 6,
            hoverRadius: 8,
            borderWidth: 2,
            tension: 0.3,
            fill: true,
          },
        ],
      });
    } catch (error) {
      console.error("Error fetching monthly data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMonthlyData();
  }, [selectedYear, selectedRtoAreas, selectedDgms, selectedGms, selectedDuration, selectedDeletedMethod]);

  return (
    <Box
      sx={{
        padding: "32px",
        minHeight: "100vh",
        backgroundColor: "#f4f6f9",
      }}
    >
      <Typography
        variant="h4"
        sx={{
          marginBottom: 3,
          textAlign: "center",
          fontWeight: "bold",
          color: "#3f51b5",
          textShadow: "1px 1px 4px rgba(0, 0, 0, 0.1)",
        }}
      >
        📊 PEOTV Disconnections Overview
      </Typography>

      <Grid container spacing={2} sx={{ marginBottom: 4 }}>
        {/* Year Filter */}
        <Grid item xs={12} md={4}>
          <FormControl fullWidth>
            <InputLabel>Select Year</InputLabel>
            <Select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              sx={{ backgroundColor: "#fff", borderRadius: "8px" }}
            >
              {years.map((year) => (
                <MenuItem key={year} value={year}>
                  {year}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        {/* RTO Area Filter */}
        <Grid item xs={12} md={4}>
          <FormControl fullWidth>
            <InputLabel>RTO Area</InputLabel>
            <Select
              multiple
              value={selectedRtoAreas}
              onChange={(e) => setSelectedRtoAreas(e.target.value)}
              sx={{ backgroundColor: "#fff", borderRadius: "8px" }}
            >
              {rtoAreas.map((area) => (
                <MenuItem key={area} value={area}>
                  {area}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        {/* DGM Filter */}
        <Grid item xs={12} md={4}>
          <FormControl fullWidth>
            <InputLabel>DGM</InputLabel>
            <Select
              multiple
              value={selectedDgms}
              onChange={(e) => setSelectedDgms(e.target.value)}
              sx={{ backgroundColor: "#fff", borderRadius: "8px" }}
            >
              {dgms.map((dgm) => (
                <MenuItem key={dgm} value={dgm}>
                  {dgm}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        {/* GM Filter */}
        <Grid item xs={12} md={4}>
          <FormControl fullWidth>
            <InputLabel>GM</InputLabel>
            <Select
              multiple
              value={selectedGms}
              onChange={(e) => setSelectedGms(e.target.value)}
              sx={{ backgroundColor: "#fff", borderRadius: "8px" }}
            >
              {gms.map((gm) => (
                <MenuItem key={gm} value={gm}>
                  {gm}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        {/* Duration Filter */}
        <Grid item xs={12} md={4}>
          <FormControl fullWidth>
            <InputLabel>Duration</InputLabel>
            <Select
              multiple
              value={selectedDuration}
              onChange={(e) => setSelectedDuration(e.target.value)}
              sx={{ backgroundColor: "#fff", borderRadius: "8px" }}
            >
              {durations.map((duration) => (
                <MenuItem key={duration} value={duration}>
                  {duration}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        {/* Deleted Method Filter */}
        <Grid item xs={12} md={4}>
          <FormControl fullWidth>
            <InputLabel>Deleted Method</InputLabel>
            <Select
              value={selectedDeletedMethod}
              onChange={(e) => setSelectedDeletedMethod(e.target.value)}
              sx={{ backgroundColor: "#fff", borderRadius: "8px" }}
            >
              <MenuItem value="all">All</MenuItem>
              {deletedMethods.map((method) => (
                <MenuItem key={method} value={method}>
                  {method}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
      </Grid>

      <ChartContainer>
        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "400px" }}>
            <CircularProgress size={80} />
          </Box>
        ) : chartData ? (
          <Line
            data={chartData}
            options={{
              responsive: true,
              animation: { duration: 1500, easing: "easeInOutQuad" },
              plugins: {
                legend: {
                  display: true,
                  position: "top",
                },
                tooltip: {
                  callbacks: {
                    label: (context) => `${context.dataset.label}: ${context.raw} disconnections`,
                  },
                },
              },
              scales: {
                x: { title: { display: true, text: "Months" }, ticks: { color: "#555" } },
                y: { title: { display: true, text: "Number of Disconnections" }, ticks: { beginAtZero: true, color: "#555" } },
              },
            }}
          />
        ) : (
          <Typography sx={{ textAlign: "center", marginTop: 4 }}>No data available for the selected filters.</Typography>
        )}
      </ChartContainer>
    </Box>
  );
};

export default PeoTvDisconnectionChart;