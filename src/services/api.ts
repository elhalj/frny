import axios from "axios";
import { useUserStore } from "../client/store/authuser";

const api = axios.create({
    baseURL: "http://localhost:5001/api",
    headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
    },
})

api.interceptors.request.use(
    (config) => {
        const token = useUserStore.getState().token;
        if (token) {
            config.headers.Authorization = `Bearer ${token}`
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
)

api.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        if (error.response && error.response.status === 401) {
            useUserStore.getState().logout();
            window.location.href = "/sign-in";
        }
        return Promise.reject(error);
    }
)

export default api;