import jwt_decode from "jwt-decode";

export const checkAuth = () => {
  const token = localStorage.getItem("token");
  if (!token) return false;

  try {
    const decoded = jwt_decode(token);
    const currentTime = Date.now() / 1000;
    return decoded.exp > currentTime;
  } catch (error) {
    return false;
  }
};

export const getUser = () => {
  const token = localStorage.getItem("token");
  if (!token) return null;

  try {
    return jwt_decode(token);
  } catch (error) {
    return null;
  }
};
