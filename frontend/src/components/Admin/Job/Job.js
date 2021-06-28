import React, { Fragment, useEffect, useReducer, useState } from "react";
import qs from "query-string";
import SideOverlay from "../../Shared/SideOverlay/SideOverlay";
import {
  DotsVerticalIcon,
  PencilAltIcon,
  SearchIcon,
  SelectorIcon,
  TrashIcon,
  JobAddIcon,
} from "@heroicons/react/solid";
import EditJob from "./EditJob";
import { useHistory } from "react-router";
import JobTable from "./JobTable";
import { useSelector } from "react-redux";
import jobApi from "../../../service/jobApi";
import Loader from "../../Shared/Loader/Loader";
import { toast } from "react-toastify";

function parseQueryOptions(location) {
  const query = qs.parse(location);
  const optionValues = {};

  if (typeof query.page === "string") {
    optionValues.page = parseFloat(query.page);
  }
  if (typeof query.limit === "string") {
    optionValues.limit = parseFloat(query.limit);
  }
  if (typeof query.sort === "string") {
    optionValues.sort = query.sort;
  }

  return optionValues;
}

function parseQueryFilters(location) {
  const query = qs.parse(location);
  const filterValues = {};

  Object.keys(query).forEach((param) => {
    const mr = param.match(/^filter_([-_A-Za-z0-9]+)$/);

    if (!mr) {
      return;
    }

    const filterSlug = mr[1];

    filterValues[filterSlug] = query[param];
  });

  return filterValues;
}

function parseQuery(location) {
  return [parseQueryOptions(location), parseQueryFilters(location)];
}

function buildQuery(options, filters) {
  const params = {};

  if (options.page !== 1) {
    params.page = options.page;
  }

  if (options.limit !== 10) {
    params.limit = options.limit;
  }

  if (options.sort !== "default") {
    params.sort = options.sort;
  }

  Object.keys(filters).forEach((filterSlug) => {
    params[`filter_${filterSlug}`] = filters[filterSlug];
  });
  return qs.stringify(params, { encode: false });
}

const initialState = {
  init: false,
  filterListIsLoading: true,
  filterList: null,
  jobsListIsLoading: true,
  jobsList: null,
  options: {},
  filters: {},
};

function reducer(state, action) {
  switch (action.type) {
    case "FETCH_FILTERS":
      return { ...state, filterListIsLoading: true };
    case "FETCH_FILTERS_SUCCESS":
      return {
        ...state,
        filterListIsLoading: false,
        filterList: action.filterList,
      };
    case "FETCH_JOBS_LIST":
      return { ...state, jobsListIsLoading: true };
    case "FETCH_JOBS_LIST_SUCCESS":
      return {
        ...state,
        jobsListIsLoading: false,
        jobsList: action.jobsList,
      };
    case "SET_OPTION_VALUE":
      console.log("SET_OPTION_VALUE");
      return {
        ...state,
        options: { ...state.options, page: 1, [action.option]: action.value },
      };
    case "SET_FILTER_VALUE":
      return {
        ...state,
        options: { ...state.options, page: 1 },
        filters: { ...state.filters, [action.filter]: action.value },
      };
    case "RESET_FILTERS":
      return { ...state, options: { ...state.options, page: 1 }, filters: {} };
    case "RESET":
      return state.init ? initialState : state;
    default:
      throw new Error();
  }
}

function init(state) {
  const [options, filters] = parseQuery(window.location.search);

  return { ...state, options, filters };
}

export default function Job() {
  const [isOpen, setIsOpen] = useState(false);
  const [isEditting, setIsEditting] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);

  const [state, dispatch] = useReducer(reducer, initialState, init);

  const history = useHistory();

  // Replace current url.
  useEffect(() => {
    const query = buildQuery(state.options, state.filters);
    const location = `${window.location.pathname}${query ? "?" : ""}${query}`;

    window.history.replaceState(null, "", location);
  }, [state.options, state.filters]);

  // Load filters list
  useEffect(() => {
    fetchFilters();
  }, [dispatch]);

  // Load jobs.
  useEffect(() => {
    fetchJobs();
  }, [dispatch, state.options, state.filters]);

  async function fetchFilters() {
    try {
      dispatch({ type: "FETCH_FILTERS" });
      const { data } = await jobApi.getFilter();
      dispatch({ type: "FETCH_FILTERS_SUCCESS", data });
    } catch (error) {
      console.log("admin->job->fetchFilters:error", error);
    }
  }

  async function fetchJobs() {
    try {
      dispatch({ type: "FETCH_JOBS_LIST" });

      const { options, filters } = state;
      const params = { ...options };
      Object.keys(filters).forEach((slug) => {
        params[`filter_${slug}`] = filters[slug];
      });

      const { data } = await jobApi.getList(params);
      dispatch({ type: "FETCH_JOBS_LIST_SUCCESS", jobsList: data });
    } catch (error) {
      console.log("admin->job->fetchJobs:error", error);
    }
  }

  if (
    state.filterListIsLoading ||
    (state.jobsListIsLoading && !state.jobsList)
  ) {
    return <Loader />;
  }

  function handleAddClick() {
    setIsEditting(false);
    setIsOpen(true);
  }

  function handleEditClick(id) {
    setIsEditting(true);
    const {
      jobsList: { items },
    } = state;

    let selectedJob = items[items.findIndex((obj) => obj._id === id)];
    setSelectedJob(selectedJob);
    setIsOpen(true);
  }

  async function handleDeleteClick(id) {
    if (window.confirm("Are you sure to delete?")) {
      try {
        const res = await jobApi.delete(id);
        dispatch({
          type: "SET_OPTION_VALUE",
          option: "page",
          value: 1,
        });
        toast.success("Deleted successfully!");
      } catch (error) {
        console.log("error", error);
        toast.success(error.message);
      }
    }
    return;
  }

  function handleClick(action, id) {
    if (action === "edit") {
      handleEditClick(id);
      return;
    }
    if (action === "delete") {
      handleDeleteClick(id);
      return;
    }
  }

  if (
    state.filterListIsLoading ||
    (state.jobsListIsLoading && !state.jobsList)
  ) {
    return <Loader />;
  }

  return (
    <div className="container mx-auto py-8">
      {/* <button
        type="submit"
        className="mb-10 mr-auto ml-10  py-2 px-4 inline-flex font-sans justify-center border border-transparent shadow-sm text-lg font-medium rounded-md text-white bg-indigo-500 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        onClick={handleAddClick}
      >
        Create Job
      </button> */}
      {state.jobsList && (
        <JobTable
          isLoading={state.jobsListIsLoading}
          jobsList={state.jobsList}
          options={state.options}
          filters={state.filters}
          dispatch={dispatch}
          onClick={handleClick}
        />
      )}

      <SideOverlay
        className="w-screen max-w-3xl relative border-l border-gray-200"
        open={isOpen}
        setOpen={setIsOpen}
      >
        {selectedJob && (
          <EditJob
            jobId={selectedJob._id}
            setOpen={setIsOpen}
            dispatch={dispatch}
          />
        )}
      </SideOverlay>
    </div>
  );
}
