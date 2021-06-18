import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

const axiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// axios.defaults.baseURL = 'https://api.example.com';
// axios.defaults.headers.common['Authorization'] = AUTH_TOKEN;
// axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';

// axiosInstance.defaults.headers.common["Authorization"] = `Bearer ${token}`;

axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  console.log("axiosInstance", token);

  config.headers.common["Authorization"] = `Bearer ${token}`;
  return config;
});

export default axiosInstance;
