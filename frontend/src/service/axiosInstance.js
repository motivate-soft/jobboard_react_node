import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

const instance = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// axios.defaults.baseURL = 'https://api.example.com';
// axios.defaults.headers.common['Authorization'] = AUTH_TOKEN;
// axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';

instance.defaults.headers.common[
  "Authorization"
] = `Bearer ${localStorage.getItem("token")}`;

// instance.interceptors.request.use((config) => {
//   config.headers.post["Authorization"] = "value";
//   return config;
// });

export default instance;
