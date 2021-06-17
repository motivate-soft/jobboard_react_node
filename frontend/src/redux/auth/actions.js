import { toast } from "react-toastify";
import {
  USER_LOGIN_FAIL,
  USER_LOGIN_REQUEST,
  USER_LOGIN_SUCCESS,
  USER_LOGOUT,
  USER_REGISTER_FAIL,
  USER_REGISTER_REQUEST,
  USER_REGISTER_SUCCESS,
  USER_UPDATE_PROFILE_FAIL,
  USER_UPDATE_PROFILE_REQUEST,
  USER_UPDATE_PROFILE_SUCCESS,
  USER_UPDATE_PROFILE_RESET,
} from "./actionTypes";
import axiosInstance from "../../service/axiosInstance";
import jwtDecode from "jwt-decode";

const authActions = {
  login: (user, history) => async (dispatch) => {
    try {
      dispatch({
        type: USER_LOGIN_REQUEST,
      });

      const {
        data: { token },
      } = await axiosInstance.post(`api/auth/login`, user);
      console.log("jwtDecode", jwtDecode(token));

      localStorage.setItem("token", JSON.stringify(token));

      dispatch({
        type: USER_LOGIN_SUCCESS,
        payload: token,
      });
      toast.success("Login successful!");
      history.push("/admin");
    } catch (error) {
      console.log("error", error);
      if (!error.response) {
        toast.warning("Can't find server!");
        return;
      }

      toast.warning(error.response.data.message || "Server error");
      dispatch({
        type: USER_LOGIN_FAIL,
        payload:
          error.response && error.response.data.message
            ? error.response.data.message
            : error.message,
      });
    }
  },

  register: (user, history) => async (dispatch) => {
    try {
      dispatch({
        type: USER_REGISTER_REQUEST,
      });

      const {
        data: { token },
      } = await axiosInstance.post(`api/auth/register`, user);
      dispatch({
        type: USER_REGISTER_SUCCESS,
        payload: token,
      });

      localStorage.setItem("token", JSON.stringify(token));

      toast.success("Registered successful!");
      history.push("/admin");
    } catch (error) {
      if (!error.response) {
        toast.warning("Can't find server!");
        return;
      }

      toast.warning(error.response.data.message || "Server error");
      dispatch({
        type: USER_REGISTER_FAIL,
        payload:
          error.response && error.response.data.message
            ? error.response.data.message
            : error.message,
      });
    }
  },

  logout: (history) => (dispatch) => {
    localStorage.removeItem("token");
    history.push("/admin/login");
    dispatch({ type: USER_LOGOUT });
  },

  //   updateUserProfile: (userObj) => async (dispatch, getState) => {
  //     try {
  //       dispatch({
  //         type: USER_UPDATE_PROFILE_REQUEST,
  //       });

  //       const {
  //         auth: { user },
  //       } = getState();

  //       const config = {
  //         headers: {
  //           "Content-Type": "application/json",
  //           Authorization: `Bearer ${user.token}`,
  //         },
  //       };
  //       const { data } = await axios.put(
  //         `${API_URL}/api/user/profile`,
  //         userObj,
  //         config
  //       );
  //       dispatch({
  //         type: USER_UPDATE_PROFILE_SUCCESS,
  //         payload: data,
  //       });
  //       const state = JSON.parse(localStorage.getItem("state"));
  //       state.auth.user = data;
  //       if (userObj.password) {
  //         toast.success("Password has been updated");
  //       } else {
  //         toast.success("Profile has been updated");
  //       }
  //       localStorage.setItem("state", JSON.stringify(state));
  //       localStorage.setItem("user", JSON.stringify(data));
  //     } catch (error) {
  //       if (!error.response) {
  //         toast.warning("Can't find server!");
  //       } else {
  //         const message =
  //           error.response && error.response.data.message
  //             ? error.response.data.message
  //             : error.message;
  //         if (message === "Not authorized, token failed") {
  //           dispatch(logout());
  //         }
  //         dispatch({
  //           type: USER_UPDATE_PROFILE_FAIL,
  //           payload: message,
  //         });
  //         toast.warning(message);
  //       }
  //     }
  //   },
};

export default authActions;
