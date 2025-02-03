import jwt_decode from "jwt-decode";
import { initWebSocket, closeWebSocket } from "./websocket";

export const checkAuth = () => {
  const token = localStorage.getItem("token");
  if (!token) return false;

  try {
    const decoded = jwt_decode(token);
    const currentTime = Date.now() / 1000;

    if (decoded.exp < currentTime) {
      handleLogout();
      return false;
    }

    return true;
  } catch (error) {
    handleLogout();
    return false;
  }
};

export const getUser = () => {
  try {
    const userStr = localStorage.getItem("user");
    return userStr ? JSON.parse(userStr) : null;
  } catch (error) {
    console.error("Error getting user:", error);
    return null;
  }
};

export const handleLogout = () => {
  closeWebSocket();
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  if (typeof window !== "undefined") {
    window.location.href = "/login";
  }
};

export const initializeWebSocket = async (token) => {
  if (!token) {
    token = localStorage.getItem("token");
  }

  if (!token) {
    console.error("No token available for WebSocket initialization");
    return false;
  }

  try {
    const ws = await initWebSocket({
      onMessage: (data) => {
        console.log("WebSocket message received:", data);
      },
      onUserUpdate: (users) => {
        console.log("Users updated:", users);
      },
    });

    return !!ws;
  } catch (error) {
    console.error("Error initializing WebSocket:", error);
    return false;
  }
};
