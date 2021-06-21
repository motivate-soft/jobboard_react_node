import { handleError } from "./utils";
import axiosInstance from "./axiosInstance";

const companyApi = {
  getAll: async () => {
    try {
      return await axiosInstance.get(`api/company/`);
    } catch (error) {
      return handleError(error);
    }
  },
  retrieve: async (companyId) => {
    try {
      return await axiosInstance.get(`api/company/${companyId}`);
    } catch (error) {
      return handleError(error);
    }
  },
  create: async (company) => {
    try {
      return await axiosInstance.post(`api/company/`, company);
    } catch (error) {
      return handleError(error);
    }
  },
  update: async (company) => {
    try {
      return await axiosInstance.put(`api/company/${company.id}`, company);
    } catch (error) {
      return handleError(error);
    }
  },
  delete: async (companyId) => {
    try {
      return await axiosInstance.delete(`api/company/${companyId}`);
    } catch (error) {
      return handleError(error);
    }
  },
};

export default companyApi;
