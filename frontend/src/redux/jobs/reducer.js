import { singleJobData, jobsData } from "../data";
import jobActions from "./actions";

const initState = {
  items: jobsData,
  selectedItem: singleJobData,
  error: "",
  loading: false,
};

export default function jobsReducer(state = initState, action) {
  switch (action.type) {
    // List
    case jobActions.GET_ALL_JOBS_REQUEST:
      return {
        ...state,
        items: [],
        loading: true,
      };
    case jobActions.GET_ALL_JOBS_SUCCESS:
      return {
        ...state,
        items: action.items,
        loading: false,
      };
    case jobActions.GET_ALL_JOBS_FAILURE:
      return {
        ...state,
        items: [],
        error: action.error,
        loading: false,
      };

    // Get one
    case jobActions.GET_JOB_REQUEST:
      return {
        ...state,
        loading: true,
      };
    case jobActions.GET_JOB_SUCCESS:
      return {
        ...state,
        items: items,
        selectedItem: action.item,
        loading: false,
      };
    case jobActions.GET_JOB_FAILURE:
      return {
        ...state,
        selectedItem: null,
        error: action.error,
        loading: false,
      };

    // Add
    case jobActions.ADD_JOB_REQUEST:
      return {
        ...state,
        loading: true,
      };
    case jobActions.ADD_JOB_SUCCESS:
      const { items } = state;
      items.push(action.item);

      return {
        ...state,
        items: items,
        selectedItem: action.item,
        loading: false,
      };
    case jobActions.ADD_JOB_FAILURE:
      return {
        ...state,
        error: action.error,
        loading: false,
      };

    // Update
    case jobActions.UPDATE_JOB_REQUEST:
      return {
        ...state,
        loading: true,
      };
    case jobActions.UPDATE_JOB_SUCCESS:
      return {
        ...state,
        selectedItem: action.item,
        loading: false,
      };
    case jobActions.UPDATE_JOB_FAILURE:
      return {
        ...state,
        error: action.error,
        loading: false,
      };

    // Delete
    case jobActions.DELETE_JOB_REQUEST:
      return {
        ...state,
        loading: true,
      };
    case jobActions.DELETE_JOB_SUCCESS:
      return {
        ...state,
        items: state.items.filter((item) => item.id !== action.jobId),
        loading: false,
      };
    case jobActions.DELETE_JOB_FAILURE:
      return {
        ...state,
        error: action.error,
        loading: false,
      };

    default:
      return state;
  }
}
