import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/solid";
import classNames from "classnames";

export default function Pagination(props) {
  const { siblings, current, total, onPageChange } = props;

  function setPage(value) {
    if (value < 1 || value > total || value === current) {
      return;
    }

    if (onPageChange) {
      onPageChange(value);
    }
  }

  function getPages() {
    const pages = [];
    const min = Math.max(
      1,
      current - siblings - Math.max(0, siblings - total + current)
    );
    const max = Math.min(total, min + siblings * 2);

    for (let i = min; i <= max; i += 1) {
      pages.push(i);
    }

    return pages;
  }

  const pages = getPages().map((page, index) => {
    const classes = classNames(
      "z-10 text-gray-900 relative inline-flex items-center px-4 py-2 border text-sm font-medium hover:cursor-pointer",
      {
        "text-indigo-600": page === current,
        "bg-indigo-50": page === current,
        // "border-indigo-500": page === current,
      }
    );

    return (
      <li key={index} className={classes} onClick={() => setPage(page)}>
        {page}
      </li>
    );
  });

  return (
    <div className="bg-white flex items-center justify-between sm:px-6">
      <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
        <ul
          className="relative mx-auto z-0 inline-flex rounded-md shadow-sm -space-x-px"
          aria-label="Pagination"
        >
          <li
            className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-200"
            onClick={() => setPage(current - 1)}
          >
            <span className="sr-only">Previous</span>
            <ChevronLeftIcon className="h-5 w-5" aria-hidden="true" />
          </li>
          {pages}
          <li
            className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
            onClick={() => setPage(current + 1)}
          >
            <span className="sr-only">Next</span>
            <ChevronRightIcon className="h-5 w-5" aria-hidden="true" />
          </li>
        </ul>
      </div>
    </div>
  );
}
