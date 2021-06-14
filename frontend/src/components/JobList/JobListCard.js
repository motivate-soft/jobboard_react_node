import moment from "moment";
import React from "react";

export default function JosListCard(props) {
  const {
    logo,
    companyName,
    position,
    primaryTag,
    tags,
    location,
    minSalary,
    maxSalary,
    howtoApply,
    isShowLogo,
    isHighlight,
    highlightColor,
    isHighlightColor,
    isStickyDay,
    isStickyWeek,
    isStickyMonth,
    postedAt,
  } = props.job;

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

  return (
    <div
      className="joblist-card cursor-pointer mb-4 px-10 py-4 border border-gray-200 rounded-md"
      style={createHighlightStyle()}
      // style={{backgroundColor: "#fff9c9"}}
    >
      <div className="grid grid-cols-12">
        <div className="col-span-1">
          {isShowLogo ? (
            <img src={logo ?? "/images/sample_logo.png"} alt="company log" />
          ) : null}
        </div>
        <div className="flex flex-col col-span-5">
          <div>
            <h4>{companyName}</h4>
          </div>
          <div>
            <h4 className="font-bold text-xl">{position}</h4>
          </div>
          <div className="flex">
            <div className="inline-flex mr-3 p-1 bg-gray-200 rounded">
              🌏 {location}
            </div>
            <div className="inline-flex p-1 bg-gray-200 rounded">
              💰 ${minSalary / 1000}k - ${maxSalary / 1000}k
            </div>
          </div>
        </div>
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
        <div className="col-span-3">
          {renderStickyWidget()}
          <button
            className={`apply-btn ${
              isHighlight || isHighlightColor
                ? "bg-white text-indigo-500"
                : "bg-indigo-500 text-white"
            } hidden mb-auto font-sans justify-center py-2 px-10 border border-transparent shadow-sm text-lg font-medium rounded-md text-white`}
          >
            Apply
          </button>
        </div>
      </div>
    </div>
  );
}
