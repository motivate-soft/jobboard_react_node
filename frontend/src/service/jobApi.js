import { handleError } from "./utils";
import axiosInstance from "./axiosInstance";
import qs from "query-string";

const jobApi = {
  getAll: async () => {
    try {
      return await axiosInstance.get(`api/job/`);
    } catch (error) {
      return handleError(error);
    }
  },
  getFilter: async () => {
    try {
      return await axiosInstance.get(`api/job/filter/`);
    } catch (error) {
      return handleError(error);
    }
  },
  getListing: async (query = {}) => {
    try {
      return await axiosInstance.get(`api/job?${qs.stringify(query)}`);
    } catch (error) {
      return handleError(error);
    }
  },
  retrieve: async (jobId) => {
    try {
      return await axiosInstance.get(`api/job/${jobId}`);
    } catch (error) {
      return handleError(error);
    }
  },
  create: async (job) => {
    try {
      return await axiosInstance.post(`api/job/`, job);
    } catch (error) {
      return handleError(error);
    }
  },
  update: async (job) => {
    try {
      return await axiosInstance.put(`api/job/${job.id}`, job);
    } catch (error) {
      return handleError(error);
    }
  },
  delete: async (jobId) => {
    try {
      return await axiosInstance.delete(`api/job/${jobId}`);
    } catch (error) {
      return handleError(error);
    }
  },
};

export default jobApi;
