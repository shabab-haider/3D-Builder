import axios from "axios";

const api = axios.create({
  baseURL: `${import.meta.env.VITE_BASE_URL}/api/designs`,
  withCredentials: true,
});

export const getDesignsAPI = async () => {
  try {
    const response = await api.get("/");
    return response;
  } catch (error) {
    throw error;
  }
};

export const deleteDesignAPI = async (id) => {
  try {
    const response = await api.delete(`/${id}`);
    return response;
  } catch (error) {
    throw error;
  }
};
