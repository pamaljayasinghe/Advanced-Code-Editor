import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const login = async (credentials) => {
  const response = await api.post("/auth/login", credentials);
  return response.data.token;
};

export const saveFile = async (content) => {
  const response = await api.post("/files/save", { content });
  return response.data;
};

export const getFile = async (fileId) => {
  const response = await api.get(`/files/${fileId}`);
  return response.data;
};
