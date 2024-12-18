import axios from 'axios';

const API_URL = 'http://localhost:8070';  // Replace with your backend API URL

// API call to get counts from the backend
export const getCounts = async () => {
  try {
    const response = await axios.get(`${API_URL}/get-counts`);
    return response.data; // returns the counts data from the backend
  } catch (error) {
    console.error("Error fetching counts", error);
    throw error;
  }
};
