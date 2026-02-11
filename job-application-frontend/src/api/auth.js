import axios from "axios";

const API_URL = "https://applyboard-job-application-tracer.onrender.com/user";

export const loginUser = (data) => {
  return axios.post(`${API_URL}/login`, data);
};

export const logout = () => {
  localStorage.removeItem("token");
};

// Helper to attach token to requests (use this for all protected calls)
export const auth = () => {
  const token = localStorage.getItem("token");
  return {
    headers: {
      Authorization: token ? `Bearer ${token}` : "",
    },
  };
};