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

const FiberStatisticsPage = () => {
  const [counts, setCounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMonth, setSelectedMonth] = useState("all");

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
      : counts.filter((item) => item.month === selectedMonth - 1); // Adjust for 1-based selection

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
      case "PEO DP BB Up_30K - E-IPTV FTTH - CREATE":
        aggregatedCounts["PEO TV BB UP (FIBER)"] += item.count;
        break;
      case "PEO DP BB Up_30K - E-IPTV COPPER - CREATE":
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

  return (
    <Box sx={{ minHeight: "100vh", background: "linear-gradient(to right, #141E30, #243B55)", padding: 4 }}>
      <Typography variant="h3" gutterBottom sx={{ textAlign: "center", color: "#fff", fontWeight: "bold", textShadow: "2px 2px 4px rgba(0, 0, 0, 0.5)" }}>
        Fiber & Copper Statistics
      </Typography>
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          {/* Fiber Statistics Section (Blue) */}
          <Grid item xs={12}>
            <Typography variant="h5" sx={{ color: "#1976D2", fontWeight: "bold", marginBottom: 2 }}>
              Fiber Statistics
            </Typography>
          </Grid>
          {[
            { label: "NEW FTTH", percentage: fiberNewAccessPercentage, color: "#1976D2" },
            { label: "MIGRATION", percentage: fiberMigrationPercentage, color: "#1976D2" },
            { label: "RECON FTTH", percentage: fiberReconPercentage, color: "#1976D2" },
          ].map((item, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Card sx={{ padding: 3, backgroundColor: item.color, color: "#fff", borderRadius: 2, boxShadow: "0px 4px 15px rgba(0, 0, 0, 0.2)", transition: "transform 0.3s ease", "&:hover": { transform: "scale(1.05)" } }}>
                <Typography variant="h6" sx={{ fontWeight: "bold", marginBottom: 2 }}>
                  {item.label}
                </Typography>
                <Typography variant="h4">{item.percentage}%</Typography>
              </Card>
            </Grid>
          ))}

          {/* Copper Statistics Section (Orange) */}
          <Grid item xs={12}>
            <Typography variant="h5" sx={{ color: "#F57C00", fontWeight: "bold", marginBottom: 2 }}>
              Copper Statistics
            </Typography>
          </Grid>
          {[
            { label: "NEW COPPER", percentage: copperNewPercentage, color: "#F57C00" },
            { label: "RECON COPPER", percentage: copperReconPercentage, color: "#F57C00" },
          ].map((item, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Card sx={{ padding: 3, backgroundColor: item.color, color: "#fff", borderRadius: 2, boxShadow: "0px 4px 15px rgba(0, 0, 0, 0.2)", transition: "transform 0.3s ease", "&:hover": { transform: "scale(1.05)" } }}>
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
    </Box>
  );
};

export default FiberStatisticsPage;
