import { handleError } from "./utils";
import axiosInstance from "./axiosInstance";

const paymentApi = {
  createPaymentIntent: async (bundle) => {
    try {
      return await axiosInstance.post(
        "api/stripe/create-payment-intent",
        bundle
      );
    } catch (error) {
      return handleError(error);
    }
  },
  createPromoCode: async (bundle) => {
    try {
      return await axiosInstance.post("api/stripe/create-promocode", bundle);
    } catch (error) {
      return handleError(error);
    }
  },
  createSubscription: async (data) => {
    try {
      return await axiosInstance.post("api/stripe/create-subscription", data);
    } catch (error) {
      return handleError(error);
    }
  },
};

export default paymentApi;
