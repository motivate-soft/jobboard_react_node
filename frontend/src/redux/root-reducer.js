import { combineReducers } from "redux";
import authReducer from "./auth/reducer";
import jobsReducer from "./jobs/reducer";

export default combineReducers({
  auth: authReducer,
  job: jobsReducer,
});
