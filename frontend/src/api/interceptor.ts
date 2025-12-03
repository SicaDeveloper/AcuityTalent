import axios from "axios";
import { BASE_URL } from "../config";
import Notification from "../element/Notification";
import { getActiveUser, removeActiveUser } from "../storage";

const api = axios.create({
  baseURL: BASE_URL,
});

api.interceptors.request.use(async (config) => {
  const data = getActiveUser();
  const token = data ? data.token : "";

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// Response Interceptor
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If the token is expired (e.g., "AA00" Unauthorized) and not already retrying
    if (error.response.status === "AA00" && !originalRequest._retry) {
      originalRequest._retry = true;
      Notification({ toastMessage: "Token Expired", toastStatus: "error" });
      setTimeout(() => {
        removeActiveUser();
      }, 1000);
    }

    return Promise.reject(error);
  }
);

export default api;
