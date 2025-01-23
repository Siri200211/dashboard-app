import React, { useState } from "react";
import {
  Button,
  Input,
  Box,
  CircularProgress,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from "@mui/material";
import axios from "axios";
import "./DisconnectionCsvUpload.css"; // Import your custom CSS file

const DisconnectionCsvUpload = () => {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [uploadProgress, setUploadProgress] = useState(0);
  const [confirmOpen, setConfirmOpen] = useState(false); // State to manage confirmation dialog

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async (replaceData) => {
    if (!file) {
      setMessage("Please select a file.");
      return;
    }

    setLoading(true);
    setMessage("");
    setUploadProgress(0);

    const formData = new FormData();
    formData.append("disconnection_file", file); // Ensure the key matches the backend field name

    try {
      const response = await axios.post(
        "http://localhost:8070/upload-disconnection-csv",
        formData,
        {
          params: { replaceData },
          headers: {
            "Content-Type": "multipart/form-data",
          },
          onUploadProgress: (progressEvent) => {
            const percentage = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            setUploadProgress(percentage);
          },
        }
      );
      setMessage(response.data);
    } catch (error) {
      setMessage("Error uploading CSV file.");
    } finally {
      setLoading(false);
      setConfirmOpen(false); // Close the confirmation dialog after upload
    }
  };

  const handleReplaceDataClick = () => {
    setConfirmOpen(true); // Open confirmation dialog for replace data
  };

  const handleConfirmClose = (confirmed) => {
    setConfirmOpen(false); // Close the dialog
    if (confirmed) {
      handleUpload(true); // Proceed with uploading and replacing data
    }
  };

  return (
    <div className="csv-container">
      <Box className="csv-box">
        <Typography variant="h4" className="csv-title">
          Upload Disconnection CSV File
        </Typography>
        <Input
          type="file"
          onChange={handleFileChange}
          className="csv-input"
        />
        <Box className="csv-buttons">
          <Button
            variant="contained"
            onClick={() => handleUpload(false)}
            disabled={loading}
            className="csv-button"
          >
            Upload New Data (Incremental)
          </Button>
          <Button
            variant="contained"
            onClick={handleReplaceDataClick}
            disabled={loading}
            className="csv-button replace"
          >
            Upload and Replace Data
          </Button>
        </Box>
        {loading && (
          <Box className="csv-progress">
            <CircularProgress variant="determinate" value={uploadProgress} />
            <Typography className="csv-percentage">{uploadProgress}%</Typography>
          </Box>
        )}
        {message && <Typography className="csv-message">{message}</Typography>}

        {/* Confirmation Dialog */}
        <Dialog
          open={confirmOpen}
          onClose={() => handleConfirmClose(false)}
        >
          <DialogTitle>Confirm Data Replacement</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Are you sure you want to replace the existing data? This action cannot be undone.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => handleConfirmClose(false)} color="primary">
              Cancel
            </Button>
            <Button
              onClick={() => handleConfirmClose(true)}
              color="secondary"
              variant="contained"
            >
              Yes, Replace Data
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </div>
  );
};

export default DisconnectionCsvUpload;