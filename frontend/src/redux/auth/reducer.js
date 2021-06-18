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
  CHANGE_PASSWORD_RESET,
} from "./actionTypes";

const initialState = {
  token: localStorage.getItem("token"),
  loading: false,
};

export default function authReducer(state = initialState, action) {
  switch (action.type) {
    case USER_LOGIN_REQUEST:
      return { ...state, loading: true };
    case USER_LOGIN_SUCCESS:
      return { ...state, loading: false, token: action.payload, error: null };
    case USER_LOGIN_FAIL:
      return { ...state, loading: false, error: action.payload };

    case USER_REGISTER_REQUEST:
      return { ...state, loading: true };
    case USER_REGISTER_SUCCESS:
      return { ...state, loading: false, token: action.payload, error: null };
    case USER_REGISTER_FAIL:
      return { ...state, loading: false, error: action.payload };

    case USER_UPDATE_PROFILE_REQUEST:
      return { ...state, loading: true };
    case USER_UPDATE_PROFILE_SUCCESS:
      return { ...state, loading: false, token: action.payload, error: null };
    case USER_UPDATE_PROFILE_FAIL:
      return { ...state, loading: false, error: action.payload };

    case CHANGE_PASSWORD_REQUEST:
      return { ...state, loading: true };
    case CHANGE_PASSWORD_SUCCESS:
      return { ...state, loading: false, token: action.payload, error: null };
    case CHANGE_PASSWORD_FAIL:
      return { ...state, loading: false, error: action.payload };

    case USER_LOGOUT:
      return {};
    default:
      return state;
  }
}
