import { combineReducers } from "redux";
import jobsReducer from "./jobs/reducer";

export default combineReducers({
  job: jobsReducer,
});
