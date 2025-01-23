import axios from "axios";

const API_URL = "http://localhost:8070"; // Update with your backend URL

// API call to get counts
export const getCounts = async () => {
  try {
    const response = await axios.get(`${API_URL}/get-counts`);
    return response.data;
  } catch (error) {
    console.error("Error fetching counts", error);
    throw error;
  }
};
export const getPeoTvCounts = async (queryString = "") => {
  try {
    const response = await axios.get(`${API_URL}/disconnection-counts${queryString}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching PEO TV counts:", error.message);
    throw error;
  }
};
export const getPeoTvCountsdis = async (queryString = "") => {
  try {
    const response = await axios.get(`${API_URL}/monthlyCounts${queryString}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching PEO TV counts:", error.message);
    throw error;
  }
};
