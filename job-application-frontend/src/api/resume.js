import axios from "axios";

const API = "https://applyboard-job-application-tracer.onrender.com";

const auth = () => ({
  headers: {
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  },
});

export const getMyResumes = () =>
  axios.get(`${API}/resumes/my`, auth());

export const uploadResume = (file) => {
  const formData = new FormData();
  formData.append("file", file);

  return axios.post(`${API}/resumes/upload`, formData, {
    headers: {
      ...auth().headers,
      "Content-Type": "multipart/form-data",
    },
  });
};