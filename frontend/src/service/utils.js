import { toast } from "react-toastify";

export const handleError = (error) => {
  if (error.response) {
    // Request made and server responded
    console.log("error.response", error.response);
    console.log("error.response.data", error.response.data);
    console.log("error.response.status", error.response.status);
    console.log("error.response.headers", error.response.headers);
    console.log("error.response.message", error.response.message);

    if (error.response.status === 401) {
      localStorage.removeItem("token");
      window.location.reload();
    }
    return {
      status: error.response.status,
      message: error.response.data,
    };
  } else if (error.request) {
    // The request was made but no response was received
    console.log("error.request", error.request);
    toast.warning("No response from server");
    return {
      message: "No response from server",
    };
  } else {
    // Something happened in setting up the request that triggered an Error
    console.log("Error", error.message);
    return {
      message: error.message,
    };
  }
};