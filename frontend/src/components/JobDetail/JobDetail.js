import React from "react";
import { Link } from "react-router-dom";
import { singleJobData } from "./../../redux/data";
import { Dialog, Transition } from "@headlessui/react";
import { XIcon } from "@heroicons/react/outline";

export default function JobDetail(props) {
  const { open, setOpen } = props;
  const {
    id,
    logo,
    description,
    companyName,
    position,
    primaryTag,
    tags,
    location,
    minSalary,
    maxSalary,
    howtoApply,
    applyEmail,
    applyUrl,

    isShowLogo,
    isHighlight,
    highlightColor,
    isHighlightColor,
    isStickyDay,
    isStickyWeek,
    isStickyMonth,
    postedAt,
  } = singleJobData;

  return (
    <div className="h-full flex flex-col bg-white shadow-xl overflow-y-scroll sm:divide-y sm:divide-gray-200">
      {/* Header */}
      <div className="px-4 py-6 bg-gray-50 sm:px-6">
        <div className="flex items-start justify-between space-x-3">
          <div className="space-y-1">
            <Dialog.Title className="text-2xl font-bold text-gray-900"></Dialog.Title>
          </div>

          <div className="h-7 flex items-center">
            <button
              type="button"
              className="bg-white rounded-md text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              onClick={() => setOpen(false)}
            >
              <span className="sr-only">Close panel</span>
              <XIcon className="h-6 w-6" aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>
      {/* Job description markdown */}
      <div
        className="px-10 py-8"
        dangerouslySetInnerHTML={{ __html: description }}
      />

      {/* Salary */}
      <div className="px-10 py-8">
        <h3 className="text-3xl font-extrabold mb-8">
          Salary and compensation
        </h3>
        $
        <span>
          {minSalary / 1000},000~${maxSalary / 1000},000
        </span>
      </div>

      {/* Location */}
      <div className="px-10 py-8">
        <h3 className="text-3xl font-extrabold mb-8">Location</h3>
        <span>🌏 {location}</span>
      </div>

      {/* How to apply */}
      <div className="px-10 py-8">
        <h3 className="text-3xl font-extrabold mb-8">How do you apply?</h3>
        <div
          className="mb-8 w-full"
          dangerouslySetInnerHTML={{ __html: howtoApply }}
        />
        {applyEmail && (
          <a
            class="button action-apply apply_104042"
            href={`mailto:${applyEmail}?subject=New applicant`}
            target="_blank"
            rel="nofollow"
            className="mx-auto  py-2 px-10 bg-indigo-500 hover:bg-indigo-700 rounded-lg"
          >
            Apply for this job
          </a>
        )}
        {applyUrl && (
          <a
            href={applyUrl}
            className="mx-auto  py-2 px-10 bg-indigo-500 hover:bg-indigo-700 rounded-lg"
          >
            Apply for this job
          </a>
        )}
      </div>
    </div>
  );
}
