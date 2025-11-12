import React, { useState, useEffect } from "react";
import axios from "axios";
import {
    Container,
    Box,
    Typography,
    Grid,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    TableContainer,
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
    Paper,
    CircularProgress,
} from "@mui/material";

const mapping = {
  "AD": { DGM: "NP", GM: "REGION 3" },
  "AG": { DGM: "WPS", GM: "REGION 2" },
  "AP": { DGM: "EP", GM: "REGION 3" },
  "BC": { DGM: "EP", GM: "REGION 3" },
  "BD": { DGM: "SAB-UVA", GM: "REGION 2" },
  "BW": { DGM: "SAB-UVA", GM: "REGION 2" },
  "CW": { DGM: "NWP", GM: "REGION 1" },
  "GL": { DGM: "SP", GM: "REGION 2" },
  "GP": { DGM: "CP", GM: "REGION 1" },
  "GQ": { DGM: "WPN", GM: "REGION 1" },
  "HB": { DGM: "SP", GM: "REGION 2" },
  "HK": { DGM: "METRO 1", GM: "METRO" },
  "HO": { DGM: "METRO 2", GM: "METRO" },
  "HR": { DGM: "WPS", GM: "REGION 2" },
  "HT": { DGM: "CP", GM: "REGION 1" },
  "JA": { DGM: "NP", GM: "REGION 3" },
  "KE": { DGM: "SAB-UVA", GM: "REGION 2" },
  "KG": { DGM: "NWP", GM: "REGION 1" },
  "KI": { DGM: "WPN", GM: "REGION 1" },
  "KL": { DGM: "EP", GM: "REGION 3" },
  "KLY": { DGM: "NWP", GM: "REGION 1" },
  "KO": { DGM: "NP", GM: "REGION 3" },
  "KON": { DGM: "METRO 1", GM: "METRO" },
  "KT": { DGM: "WPS", GM: "REGION 2" },
  "KX": { DGM: "METRO 1", GM: "METRO" },
  "KY": { DGM: "CP", GM: "REGION 1" },
  "MB": { DGM: "NP", GM: "REGION 3" },
  "MD": { DGM: "METRO 1", GM: "METRO" },
  "MH": { DGM: "SP", GM: "REGION 2" },
  "MLT": { DGM: "NP", GM: "REGION 2" },
  "MRG": { DGM: "SAB-UVA", GM: "REGION 2" },
  "MT": { DGM: "CP", GM: "REGION 1" },
  "ND": { DGM: "METRO 2", GM: "METRO" },
  "NG": { DGM: "WPN", GM: "REGION 1" },
  "NTB": { DGM: "WPN", GM: "REGION 1" },
  "NW": { DGM: "CP", GM: "REGION 1" },
  "PH": { DGM: "WPS", GM: "REGION 2" },
  "PR": { DGM: "EP", GM: "REGION 3" },
  "RM": { DGM: "METRO 2", GM: "METRO" },
  "RN": { DGM: "SAB-UVA", GM: "REGION 2" },
  "TC": { DGM: "EP", GM: "REGION 3" },
  "VA": { DGM: "NP", GM: "REGION 3" },
  "WT": { DGM: "WPN", GM: "REGION 1" },
  "YK": { DGM: "METRO 2", GM: "METRO" },
};

const CountsTable = () => {
  const [counts, setCounts] = useState([]);
  const [filters, setFilters] = useState({
    year: "all",
    month: "all",
    day: "all",
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchCounts();
  }, [filters]); // Fetch counts when filters change

  const fetchCounts = async () => {
    setLoading(true);
    try {
      const { year, month, day } = filters;
      const response = await axios.get("http://localhost:8070/get-counts-by-category-and-rto", {
        params: { year, month, day },
      });

      let target = 40; // Default target per month
      if (month === "all") {
        target = 40 * 12; // Yearly target
      } else if (day !== "all") {
        target = 40 / 30; // Daily target (approx. 1.33 per day)
      }

      const aggregatedCounts = response.data.reduce((acc, item) => {
        const rto = item._id?.rto_split; // Safe access to rto_split
        if (!rto) return acc; // Skip if rto_split is undefined

        if (!acc[rto]) {
          acc[rto] = {
            count: 0,
            DGM: "",
            GM: "",
          };
        }

        acc[rto].count += item.count; // Sum counts for the same RTO split

        // Get DGM and GM from mapping object
        if (mapping[rto]) {
          acc[rto].DGM = mapping[rto].DGM;
          acc[rto].GM = mapping[rto].GM;
        }

        return acc;
      }, {});

      // Convert object into array for rendering
      const formattedCounts = Object.entries(aggregatedCounts).map(([rto, data]) => {
        const achievement = ((data.count / target) * 100).toFixed(2); // Calculate achievement percentage

        return {
          rto_split: rto,
          count: data.count,
          target: target.toFixed(2), // Keep target in 2 decimal places
          achievement: achievement,
          DGM: data.DGM,
          GM: data.GM,
        };
      });

      setCounts(formattedCounts);
    } catch (error) {
      console.error("Error fetching counts:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #1e3c72 30%, #2a5298 90%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "20px",
      }}
    >
      <Container
        sx={{
          background: "rgba(255, 255, 255, 0.15)",
          backdropFilter: "blur(10px)",
          borderRadius: "12px",
          padding: "30px",
          boxShadow: "0px 8px 16px rgba(0, 0, 0, 0.3)",
        }}
      >
        {/* Title */}
        <Box sx={{ textAlign: "center", marginBottom: 3, color: "white" }}>
          <Typography variant="h4" gutterBottom fontWeight="bold">
            📊 Counts by RTO Split
          </Typography>
        </Box>
  
        {/* Filters */}
        <Grid container spacing={3} justifyContent="center">
          {[
            { label: "Year", name: "year", options: ["All", "2024", "2025"] },
            {
              label: "Month",
              name: "month",
              options: [
                "All",
                ...Array.from({ length: 12 }, (_, i) =>
                  new Date(2023, i).toLocaleString("default", { month: "long" })
                ),
              ],
            },
            {
              label: "Day",
              name: "day",
              options: ["All", ...Array.from({ length: 31 }, (_, i) => i + 1)],
            },
          ].map(({ label, name, options }) => (
            <Grid item key={name}>
              <FormControl
                variant="outlined"
                size="small"
                sx={{
                  background: "rgba(255, 255, 255, 0.2)",
                  borderRadius: "8px",
                }}
              >
                <InputLabel sx={{ color: "white" }}>{label}</InputLabel>
                <Select
                  label={label}
                  name={name}
                  value={filters[name]}
                  onChange={handleFilterChange}
                  sx={{
                    color: "white",
                    ".MuiOutlinedInput-notchedOutline": {
                      borderColor: "rgba(255, 255, 255, 0.5)",
                    },
                    "&:hover .MuiOutlinedInput-notchedOutline": {
                      borderColor: "white",
                    },
                    "& .MuiSvgIcon-root": {
                      color: "white",
                    },
                  }}
                >
                  {options.map((option, index) => (
                    <MenuItem key={index} value={String(option).toLowerCase()}>
                      {option}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          ))}
        </Grid>
  
        {/* Render Separate Tables for Each GM */}
        {["REGION 1", "REGION 2", "REGION 3", "METRO"].map((gm) => {
          const gmCounts = counts.filter((row) => row.GM === gm); // Filter counts for each GM
          return (
            <TableContainer
              key={gm}
              component={Paper}
              sx={{
                marginTop: 3,
                background: "rgba(255, 255, 255, 0.1)",
                backdropFilter: "blur(15px)",
                borderRadius: "12px",
                boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.2)",
                overflow: "hidden",
              }}
            >
              <Typography variant="h5" gutterBottom sx={{ textAlign: "center", color: "white" }}>
                {gm} RTO Split Counts
              </Typography>
              <Table>
              <TableHead>
                  <TableRow sx={{ background: "rgba(255, 255, 255, 0.2)" }}>
                    {["DGM", "RTO Split", "Count", "Target", "Achievement (%)"].map((head) => (
                      <TableCell key={head} sx={{ color: "white", fontWeight: "bold" }}>
                        {head}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {gmCounts.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} align="center" sx={{ color: "white" }}>
                        No data available
                      </TableCell>
                    </TableRow>
                  ) : (
                    gmCounts.map((row) => (
                      <TableRow key={row.rto_split}>
                        <TableCell sx={{ color: "white" }}>{row.DGM}</TableCell>
                        <TableCell sx={{ color: "white" }}>{row.rto_split}</TableCell>
                        <TableCell sx={{ color: "white" }}>{row.count}</TableCell>
                        <TableCell sx={{ color: "white" }}>{row.target}</TableCell>
                        <TableCell sx={{ color: "white" }}>{row.achievement}%</TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          );
        })}
  
        {/* Loading Indicator */}
        {loading && (
          <Box sx={{ display: "flex", justifyContent: "center", marginTop: 4 }}>
            <CircularProgress sx={{ color: "white" }} />
          </Box>
        )}
      </Container>
    </Box>
  );
};

export default CountsTable;