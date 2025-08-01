import axios from "axios";
import { BASE_URL } from "./apiPaths";

const api = axios.create({
  baseURL: BASE_URL,
});

// Request Interceptor
api.interceptors.request.use(
  (config) => {
    const accessToken = localStorage.getItem("token");
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
