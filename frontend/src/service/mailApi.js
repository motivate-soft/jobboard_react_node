import { handleError } from "./utils";
import axiosInstance from "./axiosInstance";

const mailApi = {
  newsletter: async (email) => {
    try {
      return await axiosInstance.post(`api/email/newsletter`, email);
    } catch (error) {
      return handleError(error);
    }
  },
};

export default mailApi;
