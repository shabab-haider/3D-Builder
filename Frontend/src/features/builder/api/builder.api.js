import axios from "axios";
const api = axios.create({
  baseURL: `${import.meta.env.VITE_BASE_URL}/api/designs`,
  withCredentials: true,
});

export const saveDesignAPI = async (designData) => {
  try {
    const response = await api.post("/save", designData);
    return response;
  } catch (error) {
    throw error;
  }
};
