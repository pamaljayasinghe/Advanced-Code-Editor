import { jwtDecode } from "jwt-decode";

export const checkAuth = () => {
  if (typeof window === "undefined") return false;

  const token = localStorage.getItem("token");
  if (!token) return false;

  try {
    const decoded = jwtDecode(token);
    const currentTime = Date.now() / 1000;
    return decoded.exp > currentTime;
  } catch (error) {
    return false;
  }
};

export const getUser = () => {
  if (typeof window === "undefined") return null;

  try {
    const userStr = localStorage.getItem("user");
    return userStr ? JSON.parse(userStr) : null;
  } catch (error) {
    return null;
  }
};

export const handleLogout = () => {
  if (typeof window === "undefined") return;

  localStorage.removeItem("token");
  localStorage.removeItem("user");
  window.location.href = "/login";
};
