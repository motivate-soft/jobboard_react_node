import { combineReducers } from "redux";
import authReducer from "./auth/reducer";
import jobsReducer from "./jobs/reducer";
import userReducer from "./user/reducer";

export default combineReducers({
  auth: authReducer,
  users: userReducer,
  jobs: jobsReducer,
});
