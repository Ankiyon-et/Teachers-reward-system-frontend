import axios from "axios";

export const api = axios.create({
  baseURL: "https://sms.henokfikadu.com/api",
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});

// Attach token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});


