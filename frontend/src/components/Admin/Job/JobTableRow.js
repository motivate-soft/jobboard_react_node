import React from "react";
import moment from "moment";
import {
  ChevronRightIcon,
  DotsVerticalIcon,
  DuplicateIcon,
  PencilAltIcon,
  SearchIcon,
  SelectorIcon,
  TrashIcon,
  UserAddIcon,
} from "@heroicons/react/solid";

const BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

export default function JobTableRow(props) {
  const { job, onClick } = props;
  const {
    _id,
    position,
    primaryTag,
    tags,
    location,
    minSalary,
    maxSalary,
    description,
    howtoApply,
    applyUrl,
    applyEmail,
    showLogo,
    blastEmail,
    highlight,
    highlightColor,
    isStickyDay,
    stickyDuration,
    status,
    company,
    createdAt,
    updatedAt,
  } = job;

  function renderStatusBadge(status) {
    let bgClass;
    switch (status) {
      case "pending":
        bgClass = "bg-blue-500";
        break;
      case "approved":
        bgClass = "bg-green-500";
        break;
      case "declined":
        bgClass = "bg-yellow-500";
        break;
      default:
        bgClass = "bg-blue-500";
    }
    return (
      <div
        className={`inline-flex mx-auto bg-blue-500 p-2 rounded text-sm text-white uppercase ${bgClass}`}
      >
        {status}
      </div>
    );
  }

  return (
    <tr className="text-gray-900">
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center">
          <div className="flex-shrink-0 h-10 w-10">
            {showLogo ? (
              <img
                src={
                  company.logo
                    ? `${BASE_URL}/uploads/${company.logo}`
                    : "/images/sample_logo.png"
                }
                className="h-10 w-10"
                alt="company log"
              />
            ) : null}
          </div>
          <div className="ml-4">
            <div className="text-base font-semibold">{company.name}</div>
          </div>
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-lg">{position}</div>
        {/* <div className="text-sm">
          <div className="col-span-3 flex flex-wrap">
            {primaryTag && (
              <div className="mr-1 mb-1 px-1 max-h-7 rounded border-black border-2">
                {primaryTag}
              </div>
            )}
            {tags &&
              tags.map((tag, index) => (
                <div
                  key={index}
                  className="mr-1 mb-1 px-1 max-h-7 rounded border-black border-2"
                >
                  {tag}
                </div>
              ))}
          </div>
        </div> */}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-lg">{location}</td>
      <td className="px-6 py-4 whitespace-nowrap text-lg">
        ${minSalary / 1000}k - ${maxSalary / 1000}k
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        {renderStatusBadge(status)}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-lg">
        <div className="flex">
          <span onClick={() => onClick("edit", _id)}>
            <PencilAltIcon
              className="mr-3 h-5 w-5 text-gray-400 group-hover:text-gray-500"
              aria-hidden="true"
            />
          </span>
          <span onClick={() => onClick("delete", _id)}>
            <TrashIcon
              className="mr-3 h-5 w-5 text-gray-400 group-hover:text-gray-500"
              aria-hidden="true"
            />
          </span>
        </div>
      </td>
    </tr>
  );
}
