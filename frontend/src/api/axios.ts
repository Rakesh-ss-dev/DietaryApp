import axios from "axios";

const SERVER_URL = import.meta.env.VITE_SERVER_URL; 

// Create Axios instance
const axiosInstance = axios.create({
  baseURL: SERVER_URL,
});

// Add interceptor to inject token automatically
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token"); // Or from Redux/Context
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default axiosInstance;
