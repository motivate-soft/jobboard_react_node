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
  CHANGE_PASSWORD_REQUEST,
  CHANGE_PASSWORD_SUCCESS,
  CHANGE_PASSWORD_FAIL,
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

      localStorage.setItem("token", token);

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

      localStorage.setItem("token", token);

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

  updateProfile: (user, history) => async (dispatch) => {
    try {
      dispatch({
        type: USER_UPDATE_PROFILE_REQUEST,
      });

      const {
        data: { token },
      } = await axiosInstance.put(`api/auth/`, user);
      console.log("jwtDecode", jwtDecode(token));

      localStorage.setItem("token", token);

      dispatch({
        type: USER_UPDATE_PROFILE_SUCCESS,
        payload: token,
      });
      toast.success("Profile updated successful!");
      history.push("/admin");
    } catch (error) {
      console.log("error", error);
      if (!error.response) {
        toast.warning("Can't find server!");
        return;
      }

      toast.warning(error.response.data.message || "Server error");
      dispatch({
        type: USER_UPDATE_PROFILE_FAIL,
        payload:
          error.response && error.response.data.message
            ? error.response.data.message
            : error.message,
      });
    }
  },

  changePassword: (user, history) => async (dispatch) => {
    try {
      console.log("changePassword->");
      dispatch({
        type: CHANGE_PASSWORD_REQUEST,
      });

      const {
        data: { token },
      } = await axiosInstance.post(`api/password/change`, user);

      localStorage.setItem("token", token);

      dispatch({
        type: CHANGE_PASSWORD_SUCCESS,
        payload: token,
      });
      toast.success("Password updated successful!");
      history.push("/admin");
    } catch (error) {
      if (!error.response) {
        toast.warning("Can't find server!");
        return;
      }

      toast.warning(error.response.data.message || "Server error");
      dispatch({
        type: CHANGE_PASSWORD_FAIL,
        payload:
          error.response && error.response.data.message
            ? error.response.data.message
            : error.message,
      });
    }
  },
};

export default authActions;
