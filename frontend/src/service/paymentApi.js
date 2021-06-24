import { handleError } from "./utils";
import axiosInstance from "./axiosInstance";
import axios from "axios";

const paymentApi = {
  onetimeCharge: async (amount, stripe) => {
    const { token } = await stripe.createToken({
      name: "customer name",
    });

    try {
      const order = await axiosInstance.post("api/payment/postCharge", {
        amount,
        source: token.id,
        receipt_email: "customer@example.com",
      });
      return await axiosInstance.post(`api/media/`, media);
    } catch (error) {
      return handleError(error);
    }
  },
};

export default paymentApi;
