import React, { Fragment, useCallback } from "react";
import JobTableRow from "./JobTableRow";
import Pagination from "./Pagination";

const statusOptions = ["pending", "approved", "declined"];

function useSetOption(option, filter, dispatch) {
  const callback = useCallback(filter, []);

  return useCallback(
    (data) => {
      dispatch({
        type: "SET_OPTION_VALUE",
        option,
        value: callback(data),
      });
    },
    [option, callback, dispatch]
  );
}

export default function JobTable(props) {
  const { isLoading, jobsList, options, filters, dispatch, onClick } = props;

  const handlePageChange = useSetOption("page", parseFloat, dispatch);
  const handleSortChange = useSetOption(
    "sort",
    (event) => event.target.value,
    dispatch
  );
  const handleLimitChange = useSetOption(
    "limit",
    (event) => parseFloat(event.target.value),
    dispatch
  );

  const handleResetFilters = useCallback(() => {
    dispatch({ type: "RESET_FILTERS" });
  }, [dispatch]);

  const filtersCount = Object.keys(filters)
    .map((x) => filters[x])
    .filter((x) => x).length;

  const jobsListItems = jobsList.items.map((job) => (
    <JobTableRow key={job._id} job={job} onClick={onClick} />
  ));

  return (
    <Fragment>
      <div className="flex justify-between">
        <div className="flex ml-auto">
          <label
            htmlFor="pageSize"
            className="flex items-center px-3 text-md font-semibold text-gray-900"
          >
            Show
          </label>
          <div>
            <select
              id="pageSize"
              value={options.limit || jobsList.pageSize}
              onChange={handleLimitChange}
            >
              <option value="10">10</option>
              <option value="20">20</option>
              <option value="30">30</option>
            </select>
          </div>
        </div>
      </div>
      <div className="relative flex justify-center mb-12 w-full">
        <div className="absolute left-0 leading-10 p-0">
          {`Showing ${jobsList.from}—${jobsList.to} of ${jobsList.recordsFiltered} jobs`}
        </div>
        <Pagination
          siblings={2}
          current={jobsList.pageIndex}
          total={jobsList.pageCount}
          onPageChange={handlePageChange}
        />
      </div>

      <table className="min-w-full overflow-scroll divide-y divide-gray-200 border-b border-gray-200">
        <thead className="bg-gray-200">
          <tr>
            <th scope="col" className="th-default">
              Name
            </th>
            <th scope="col" className="th-default">
              Position
            </th>
            <th scope="col" className="th-default">
              Location
            </th>
            <th scope="col" className="th-default">
              Salary
            </th>
            <th scope="col" className="th-default">
              Status
            </th>
            <th scope="col" className="th-default">
              Action
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {jobsListItems}
        </tbody>
      </table>
      <div className="flex justify-center mt-12 mb-20 w-full">
        <Pagination
          siblings={2}
          current={jobsList.pageIndex}
          total={jobsList.pageCount}
          onPageChange={handlePageChange}
        />
      </div>
    </Fragment>
  );
}
