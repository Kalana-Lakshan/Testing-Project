import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "/api", // Change this to your API base URL
  timeout: 10000,
  headers: {
    "Content-Type": "application/json"
  }
});

export default axiosInstance;
