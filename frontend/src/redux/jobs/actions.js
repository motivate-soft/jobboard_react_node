const jobActions = {
  GET_ALL_JOBS_REQUEST: "GET_ALL_JOBS_REQUEST",
  GET_ALL_JOBS_SUCCESS: "GET_ALL_JOBS_SUCCESS",
  GET_ALL_JOBS_FAILURE: "GET_ALL_JOBS_FAILURE",
  GET_JOB_REQUEST: "GET_JOB_REQUEST",
  GET_JOB_SUCCESS: "GET_JOB_SUCCESS",
  GET_JOB_FAILURE: "GET_JOB_FAILURE",
  ADD_JOB_REQUEST: "ADD_JOB_REQUEST",
  ADD_JOB_SUCCESS: "ADD_JOB_SUCCESS",
  ADD_JOB_FAILURE: "ADD_JOB_FAILURE",
  UPDATE_JOB_REQUEST: "UPDATE_JOB_REQUEST",
  UPDATE_JOB_SUCCESS: "UPDATE_JOB_SUCCESS",
  UPDATE_JOB_FAILURE: "UPDATE_JOB_FAILURE",
  DELETE_JOB_REQUEST: "DELETE_JOB_REQUEST",
  DELETE_JOB_SUCCESS: "DELETE_JOB_SUCCESS",
  DELETE_JOB_FAILURE: "DELETE_JOB_FAILURE",

  getAllJobs: () => ({
    type: jobActions.GET_ALL_JOBS_REQUEST,
  }),
  getJob: (jobId) => ({
    type: jobActions.GET_JOB_REQUEST,
    payload: { jobId },
  }),
  addJob: (job) => ({
    type: jobActions.ADD_JOB_REQUEST,
    payload: { job },
  }),
  updateJob: (job) => ({
    type: jobActions.UPDATE_JOB_REQUEST,
    payload: { job },
  }),
  deleteJob: (jobId) => ({
    type: jobActions.DELETE_JOB_REQUEST,
    payload: { jobId },
  }),
};

export default jobActions;
