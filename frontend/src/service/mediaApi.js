import { handleError } from "./utils";
import axiosInstance from "./axiosInstance";
import axios from "axios";

const mediaApi = {
  getAll: async () => {
    try {
      return await axiosInstance.get(`api/media/`);
    } catch (error) {
      return handleError(error);
    }
  },
  retrieve: async (mediaId) => {
    try {
      return await axiosInstance.get(`api/media/${mediaId}`);
    } catch (error) {
      return handleError(error);
    }
  },
  create: async (media) => {
    try {
      return await axiosInstance.post(`api/media/`, media);
    } catch (error) {
      return handleError(error);
    }
  },
  update: async (media) => {
    try {
      return await axiosInstance.put(`api/media/${media.id}`, media);
    } catch (error) {
      return handleError(error);
    }
  },
  delete: async (mediaId) => {
    try {
      return await axiosInstance.delete(`api/media/${mediaId}`);
    } catch (error) {
      return handleError(error);
    }
  },
};

export default mediaApi;
