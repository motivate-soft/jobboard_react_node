import React from "react";
import moment from "moment";
import { useDispatch } from "react-redux";
import jobActions from "../../redux/jobs/actions";

export default function JobListTableRow(props) {
  const { job, onClick } = props;
  const {
    id,
    logo,
    companyName,
    position,
    primaryTag,
    tags,
    location,
    minSalary,
    maxSalary,
    howtoApply,
    applyUrl,
    applyEmail,
    isShowLogo,
    isHighlight,
    highlightColor,
    isHighlightColor,
    isStickyDay,
    isStickyWeek,
    isStickyMonth,
    postedAt,
  } = job;

  const dispatch = useDispatch();

  function createHighlightStyle() {
    console.log("createHighlightStyle", isHighlight);
    let bgColor = "#ffffff";
    if (isHighlight) {
      bgColor = "#fff9c9";
    }
    if (isHighlightColor) {
      bgColor = highlightColor;
    }
    return {
      backgroundColor: bgColor,
    };
  }

  function renderStickyWidget() {
    if (isStickyWeek && postedAt) {
      const leftDays = moment(postedAt).add(7, "d").diff(moment.now(), "d");
      return <span className="mr-3">📌 {leftDays}d</span>;
    }
    if (isStickyMonth && postedAt) {
      const leftDays = moment(postedAt).add(1, "M").diff(moment.now(), "d");
      return <span className="mr-3">📌 {leftDays}d</span>;
    }
    return;
  }

  function renderApplyButton() {
    if (applyEmail && applyEmail !== "") {
      return (
        <a
          class="button action-apply apply_104042"
          href={`mailto:${applyEmail}?subject=New applicant`}
          target="_blank"
          rel="nofollow"
          className={`apply-btn ${
            isHighlight || isHighlightColor
              ? "bg-white text-indigo-500"
              : "bg-indigo-500 text-white"
          } mb-auto font-sans justify-center py-2 px-10 border border-transparent shadow-sm text-lg font-medium rounded-md text-white`}
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
          className={`apply-btn ${
            isHighlight || isHighlightColor
              ? "bg-white text-indigo-500"
              : "bg-indigo-500 text-white"
          } mb-auto font-sans justify-center py-2 px-10 border border-transparent shadow-sm text-lg font-medium rounded-md text-white`}
        >
          Apply
        </a>
      );
    }
  }

  function handleClick(id) {
    dispatch(jobActions.getJob(id));
  }

  return (
    <tr
      style={createHighlightStyle()}
      className="text-gray-900"
      onClick={(e) => onClick(id)}
    >
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center">
          <div className="flex-shrink-0 h-10 w-10">
            {isShowLogo ? (
              <img
                src={logo ?? "/images/sample_logo.png"}
                className="h-10 w-10"
                alt="company log"
              />
            ) : null}
          </div>
          <div className="ml-4">
            <div className="text-sm font-semibold">{companyName}</div>
          </div>
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-xl font-bold">{position}</div>
        <div className="text-sm">
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
        </div>
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
