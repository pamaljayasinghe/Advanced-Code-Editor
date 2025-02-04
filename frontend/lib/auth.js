import { jwtDecode } from "jwt-decode"; // Changed from jwt_decode to jwtDecode

export const checkAuth = () => {
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
  try {
    const token = localStorage.getItem("token");
    if (!token) return null;
    return jwtDecode(token);
  } catch (error) {
    return null;
  }
};

export const handleLogout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  if (typeof window !== "undefined") {
    window.location.href = "/login";
  }
};
