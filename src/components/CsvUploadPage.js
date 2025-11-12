import React, { useState } from "react";
import {
  Button,
  Box,
  CircularProgress,
  Typography,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Grid,
  TextField,
} from "@mui/material";
import axios from "axios";
import "./CsvUploadPage.css"; // Custom styles

const CsvUploadPage = () => {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [uploadProgress, setUploadProgress] = useState(0);
  const [deleteYear, setDeleteYear] = useState("");
  const [deleteMonth, setDeleteMonth] = useState("");
  const [deleteDay, setDeleteDay] = useState("");

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) {
      setMessage("Please select a file.");
      return;
    }

    setLoading(true);
    setMessage("");
    setUploadProgress(0);

    const formData = new FormData();
    formData.append("sales_details_2024", file);

    try {
      const response = await axios.post("http://localhost:8070/upload-csv", formData, {
        headers: { "Content-Type": "multipart/form-data" },
        onUploadProgress: (progressEvent) => {
          const percentage = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setUploadProgress(percentage);
        },
      });
      setMessage(response.data);
    } catch (error) {
      setMessage("Error uploading CSV file.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteYear) {
      setMessage("Please select at least a year to delete data.");
      return;
    }
    try {
      setLoading(true);
      const response = await axios.delete("http://localhost:8070/delete-data", {
        params: { year: deleteYear, month: deleteMonth, day: deleteDay },
      });
      setMessage(response.data);
    } catch (error) {
      setMessage("Error deleting data.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="csv-container">
      <Box className="csv-box" p={4} boxShadow={3} borderRadius={2}>
        <Typography variant="h4" gutterBottom textAlign="center">
          Upload CSV File
        </Typography>
        <TextField type="file" onChange={handleFileChange} fullWidth variant="outlined" />
        
        <Box mt={3}>
          <Typography variant="h6">Delete Data by Date</Typography>
          <Grid container spacing={2} mt={1}>
            <Grid item xs={4}>
              <FormControl fullWidth>
                <InputLabel>Year</InputLabel>
                <Select value={deleteYear} onChange={(e) => setDeleteYear(e.target.value)}>
                  {[2023, 2024, 2025].map((year) => (
                    <MenuItem key={year} value={year}>{year}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={4}>
              <FormControl fullWidth>
                <InputLabel>Month</InputLabel>
                <Select value={deleteMonth} onChange={(e) => setDeleteMonth(e.target.value)}>
                  {Array.from({ length: 12 }, (_, i) => (
                    <MenuItem key={i} value={i + 1}>{new Date(0, i).toLocaleString('default', { month: 'long' })}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={4}>
              <FormControl fullWidth>
                <InputLabel>Day</InputLabel>
                <Select value={deleteDay} onChange={(e) => setDeleteDay(e.target.value)}>
                  {Array.from({ length: 31 }, (_, i) => (
                    <MenuItem key={i} value={i + 1}>{i + 1}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </Box>
        
        <Box mt={3} display="flex" justifyContent="center" gap={2}>
          <Button variant="contained" color="primary" onClick={handleUpload} disabled={loading}>
            Upload CSV
          </Button>
          <Button variant="contained" color="secondary" onClick={handleDelete} disabled={loading}>
            Delete Data
          </Button>
        </Box>

        {loading && (
          <Box mt={3} textAlign="center">
            <CircularProgress variant="determinate" value={uploadProgress} />
            <Typography mt={1}>{uploadProgress}%</Typography>
          </Box>
        )}

        {message && <Typography mt={2} color="error" textAlign="center">{message}</Typography>}
      </Box>
    </div>
  );
};

export default CsvUploadPage;
