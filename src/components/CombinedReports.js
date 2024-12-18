import React from "react";
import { Box, Typography, Divider } from "@mui/material";
import FiberOrders from "./FiberOrders"; // Adjust the path if needed
import Overview from "./Overview"; // Adjust the path if needed
import FiberStatisticsPage from "./FiberStatisticsPage"; // Adjust the path if needed

const CombinedReports = () => {
  return (
    <Box sx={{ margin: 0, padding: 0 }}>

      {/* Fiber Orders Section */}
      <Box sx={{ my: 0, py: 0 }}>
        <Typography
          variant="h4"
          sx={{
            fontWeight: "bold",
            textAlign: "center",
            color: "#0571eb",
            marginBottom: 0,
            paddingBottom: 0,
          }}
        >
          {/* Fiber Orders Title */}
        </Typography>
        <FiberOrders />
      </Box>

      {/* Divider Between Sections */}
      <Divider sx={{ my: 0 }} />

      {/* PEO TV Daily Sales Section */}
      <Box sx={{ my: 0, py: 0 }}>
        <Typography
          variant="h4"
          sx={{
            fontWeight: "bold",
            textAlign: "center",
            color: "#0571eb",
            marginBottom: 0,
            paddingBottom: 0,
          }}
        >
          {/* Overview Title */}
        </Typography>
        <Overview />
      </Box>

      {/* Divider Between Sections */}
      <Divider sx={{ my: 0 }} />

      {/* Fiber Statistics Section */}
      <Box sx={{ my: 0, py: 0 }}>
        <Typography
          variant="h4"
          sx={{
            fontWeight: "bold",
            textAlign: "center",
            color: "#0571eb",
            marginBottom: 0,
            paddingBottom: 0,
          }}
        >
          {/* Fiber Statistics Title */}
        </Typography>
        <FiberStatisticsPage />
      </Box>
    </Box>
  );
};

export default CombinedReports;
