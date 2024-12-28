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
  Chip,
} from "@mui/material";
import { getPeoTvCounts } from "../services/api";

const PeoTvCounts = () => {
  const [counts, setCounts] = useState(null);
  const [loading, setLoading] = useState(true);

  // Filters
  const [selectedYear, setSelectedYear] = useState("all");
  const [selectedMonth, setSelectedMonth] = useState("all");
  const [selectedDay, setSelectedDay] = useState("all");
  const [selectedRtoArea, setSelectedRtoArea] = useState("all");
  const [selectedDeletedMethod, setSelectedDeletedMethod] = useState("");
  const [selectedDuration, setSelectedDuration] = useState("");
  const [selectedDGM, setSelectedDGM] = useState("all");
  const [selectedGM, setSelectedGM] = useState("all");

  const years = [2023, 2024];
  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
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
    "RTO - WT",];
  const deletedMethods = ["Customer Requested", "Non Payment"];
  const durations = [
    "below 1 year", "1 year to 2 years", "2 years to 3 years",
    "3 years to 4 years", "4 years to 5 years", "more than 5 years"
  ];
  const dgms = ["NP", "WPS", "EP", "SAB & UVA", "NWP", "SP", "CP", "WPN", "METRO 1", "METRO 2"];
  const gms = ["REGION 1", "REGION 2", "REGION 3", "METRO"];

  const fetchData = async () => {
    try {
      setLoading(true);

      const params = {
        year: selectedYear !== "all" ? selectedYear : undefined,
        month: selectedMonth !== "all" ? months.indexOf(selectedMonth) + 1 : undefined,
        day: selectedDay !== "all" ? selectedDay : undefined,
        order_line_rto_area: selectedRtoArea !== "all" ? selectedRtoArea : undefined,
        deleted_method: selectedDeletedMethod || undefined,
        duration: selectedDuration || undefined,
        DGM: selectedDGM !== "all" ? selectedDGM : undefined,
        GM: selectedGM !== "all" ? selectedGM : undefined,
      };

      // Clean the params by removing undefined values
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

  // Handle Filter Chips
  const activeFilters = [
    { label: selectedYear, name: "Year" },
    { label: selectedMonth, name: "Month" },
    { label: selectedDay, name: "Day" },
    { label: selectedRtoArea, name: "RTO Area" },
    { label: selectedDeletedMethod, name: "Deleted Method" },
    { label: selectedDuration, name: "Duration" },
    { label: selectedDGM, name: "DGM" },
    { label: selectedGM, name: "GM" },
  ].filter((filter) => filter.label !== "all");

  if (loading) {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          background: "linear-gradient(to right, #141E30, #243B55)",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <CircularProgress color="secondary" />
      </Box>
    );
  }

  // Map the keys to human-readable names
  const mapKeyToLabel = (key) => {
    switch (key) {
      case 'peo_tv_copper':
        return 'PEO TV WITH COPPER';
      case 'peo_tv_fiber':
        return 'PEO TV WITH FIBER';
      case 'peo_tv_disconnections':
        return 'PEO TV DISCONNECTIONS';
      default:
        return key.replace(/_/g, " ").toUpperCase(); // Default behavior for other keys
    }
  };

  // Determine gradient based on type
  const getGradientBackground = (type) => {
    switch (type) {
      case 'peo_tv_fiber':
        return 'linear-gradient(145deg, #0A237D, #0D47A1)'; // Blue gradient for Fiber Disconnections
      case 'peo_tv_copper':
        return 'linear-gradient(145deg, #1B5E20, #388E3C)'; // Dark Green gradient for Copper Disconnections
      case 'peo_tv_disconnections':
        return 'linear-gradient(145deg, #D35D00, #FF8C00)'; // Orange gradient for PEO TV Disconnections
      default:
        return 'linear-gradient(145deg, #8B0000, #FF6347)'; // Red gradient for Other Disconnections
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: `url(/BG.jpg)`, // Add background image from public folder
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
      <Container maxWidth="lg">
        {/* Filter Section */}
        <Grid container spacing={4}>
          <Grid item xs={12}>
            <Typography
              variant="h5"
              sx={{
                color: "#00c6ff",
                fontWeight: "bold",
                marginBottom: 2,
                textShadow: "1px 1px 2px rgba(0, 0, 0, 0.5)",
              }}
            >
              Filters
            </Typography>
          </Grid>
          {[
            { label: "Year", value: selectedYear, options: years, onChange: setSelectedYear },
            { label: "Month", value: selectedMonth, options: months, onChange: setSelectedMonth },
            { label: "Day", value: selectedDay, options: days, onChange: setSelectedDay },
            { label: "RTO Area", value: selectedRtoArea, options: rtoAreas, onChange: setSelectedRtoArea },
            { label: "Deleted Method", value: selectedDeletedMethod, options: deletedMethods, onChange: setSelectedDeletedMethod },
            { label: "Duration", value: selectedDuration, options: durations, onChange: setSelectedDuration },
            { label: "DGM", value: selectedDGM, options: dgms, onChange: setSelectedDGM },
            { label: "GM", value: selectedGM, options: gms, onChange: setSelectedGM },
          ].map((filter, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Card sx={{ padding: 2, background: "rgba(255, 255, 255, 0.1)", boxShadow: 3, borderRadius: 2 }}>
                <FormControl fullWidth>
                  <InputLabel sx={{ color: "#00c6ff", fontWeight: "bold" }}>{filter.label}</InputLabel>
                  <Select
                    value={filter.value}
                    onChange={(e) => filter.onChange(e.target.value)}
                    sx={{
                      color: "#fff",
                      background: "rgba(0, 0, 0, 0.6)",
                      "& .MuiSelect-icon": {
                        color: "#fff",
                      },
                    }}
                    label={filter.label}
                  >
                    <MenuItem value="all">All</MenuItem>
                    {filter.options.map((option, idx) => (
                      <MenuItem value={option} key={idx}>
                        {option}
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
              }}
              onClick={applyFilters}
            >
              Apply Filters
            </Button>
          </Grid>
        </Grid>

        {/* Filter Chips */}
        {activeFilters.length > 0 && (
          <Box sx={{ marginTop: 3 }}>
            {activeFilters.map((filter, idx) => (
              <Chip
                key={idx}
                label={`${filter.name}: ${filter.label}`}
                sx={{ margin: 1, backgroundColor: "#00c6ff", color: "#fff" }}
              />
            ))}
          </Box>
        )}

        {/* Display Data */}
        <Grid container spacing={2} sx={{ marginTop: 3 }}>
          {counts && Object.keys(counts).map((key, idx) => (
            <Grid item xs={12} sm={6} md={4} key={idx} sx={{ animation: "fadeIn 0.5s ease-out" }}>
              <Card
                sx={{
                  padding: 3,
                  background: getGradientBackground(key),
                  color: "#fff",
                  borderRadius: 2,
                  boxShadow: 3,
                  transition: "transform 0.3s",
                  "&:hover": { transform: "scale(1.05)" },
                }}
              >
                <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                  {mapKeyToLabel(key)} {/* Use the map function to update label */}
                </Typography>
                <Typography variant="h4">{counts[key]}</Typography>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

export default PeoTvCounts;
