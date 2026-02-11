import axios from "axios";

const API = "http://localhost:8080";

const auth = () => ({
  headers: {
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  },
});

export const getMyApplications = async () => {
  try {
    const res = await axios.get(`${API}/applications/my`, auth());
    // Force array shape
    return {
      data: Array.isArray(res.data) ? res.data : [],
    };
  } catch (err) {
    console.error("getMyApplications failed", err);
    return { data: [] };
  }
};

export const createApplication = (data) =>
  axios.post(`${API}/applications`, data, auth());

export const updateApplication = (id, data) =>
  axios.put(`${API}/applications/${id}`, data, auth());

export const deleteApplication = (id) =>
  axios.delete(`${API}/applications/${id}`, auth());

export const updateStatus = (id, status) =>
  axios.patch(`${API}/applications/${id}/status`, { status }, auth());

export const attachResume = (appId, resumeId) =>
  axios.put(
    `${API}/applications/${appId}/resume/${resumeId}`,
    {},
    auth()
  );