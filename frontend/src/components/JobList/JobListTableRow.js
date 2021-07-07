import React from "react";
import moment from "moment";
import { useDispatch } from "react-redux";
import jobActions from "../../redux/jobs/actions";
import classNames from "classnames";

const BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

export default function JobListTableRow(props) {
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
    brandColor,
    isStickyDay,
    stickyDuration,
    stickyDaysLeft,
    status,
    company,
    createdAt,
    updatedAt,
  } = job;

  function createBackgroundStyle() {
    let bgColor = "#ffffff";
    if (highlight) {
      bgColor = "#fff9c9";
    }
    if (highlightColor && brandColor) {
      bgColor = brandColor;
    }
    return {
      backgroundColor: bgColor,
    };
  }

  function renderStickyWidget() {
    if (stickyDaysLeft < 0 || stickyDaysLeft > 30) return null;
    // moment().add(stickyDaysLeft, "d").diff(moment.now(), "h")
    if (stickyDaysLeft < 1) {
      return (
        <span className="mr-3">📌 {Math.floor(stickyDaysLeft * 24)} h</span>
      );
    }

    return <span className="mr-3">📌 {Math.ceil(stickyDaysLeft)} d</span>;
  }

  function renderApplyButton() {
    if (applyEmail && applyEmail !== "") {
      return (
        <a
          href={`mailto:${applyEmail}?subject=New applicant`}
          target="_blank"
          rel="nofollow"
          className={classNames("px-6", {
            "btn-indigo-sm": highlightColor !== null,
            "btn-indigo-outlined-sm": highlightColor === null,
          })}
        >
          Apply
        </a>
      );
    }

    if (applyUrl && applyUrl !== "") {
      return (
        <a
          href={applyUrl}
          target="_blank"
          className={classNames("px-6", {
            "btn-indigo-sm": highlightColor !== null,
            "btn-indigo-outlined-sm": highlightColor === null,
          })}
        >
          Apply
        </a>
      );
    }
  }

  return (
    <tr
      style={createBackgroundStyle()}
      className="text-gray-900 cursor-pointer"
      onClick={(e) => onClick(_id)}
    >
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
            <div className="text-sm font-semibold">{company.name}</div>
          </div>
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-xl font-bold">{position}</div>
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
      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
        {renderStickyWidget()}
        {renderApplyButton()}
      </td>
    </tr>
  );
}
