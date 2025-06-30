import axios from "axios";
import { useUserStore } from "../store/authuser";
import { useVendorStore } from "../store/authvendor";

const api = axios.create({
  baseURL: "http://localhost:5001/api",
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  (config) => {
    const userToken = useUserStore.getState().token;
    const vendorToken = useVendorStore.getState().token;
    const token = userToken || vendorToken;
    if (token) {
      if (config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response && error.response.status === 401) {
      useUserStore.getState().logout();
      useVendorStore.getState().logout();
      window.location.href = "/sign-in";
    }
    return Promise.reject(error);
  }
);

export default api;
