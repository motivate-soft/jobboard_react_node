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

  function renderApplyButton() {
    if (applyEmail && applyEmail !== "") {
      return (
        <a
          class="button action-apply apply_104042"
          href={`mailto:${applyEmail}?subject=New applicant`}
          target="_blank"
          rel="nofollow"
          className="bg-indigo-500 text-white mb-auto font-sans justify-center py-2 px-10 border border-transparent shadow-sm text-lg font-medium rounded-md"
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
          className="bg-indigo-500 text-white mb-auto font-sans justify-center py-2 px-10 border border-transparent shadow-sm text-lg font-medium rounded-md"
        >
          Apply
        </a>
      );
    }
  }

  return (
    <div className="h-full flex flex-col bg-white shadow-xl overflow-y-scroll">
      <div className="flex-1 pb-20">
        {/* Header */}
        <div className="px-4 py-6 bg-gray-50 sm:px-6">
          <div className="flex items-start justify-between space-x-3">
            <div className="space-y-1">
              <Dialog.Title className="text-2xl text-center font-bold text-gray-900">
                Job Detail
              </Dialog.Title>
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

        {/* Divider container */}
        <div className="py-6 space-y-6 sm:py-0 sm:space-y-0 sm:divide-y sm:divide-gray-200">
          {/* Job description */}
          <div className="space-y-1 px-4 sm:space-y-0 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 sm:py-5">
            <div>
              <label
                htmlFor="jobDescription"
                className="block text-lg font-medium text-gray-900 sm:mt-px sm:pt-2"
              >
                Description
              </label>
            </div>
            <div className="sm:col-span-2">
              <div dangerouslySetInnerHTML={{ __html: description }} />
            </div>
          </div>

          {/* Salary */}
          <div className="space-y-1 px-4 sm:space-y-0 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 sm:py-5">
            <div>
              <label
                htmlFor="salary"
                className="block text-lg font-medium text-gray-900 sm:mt-px sm:pt-2"
              >
                Salary
              </label>
            </div>
            <div className="sm:col-span-2">
              ${minSalary / 1000},000~${maxSalary / 1000},000
            </div>
          </div>

          {/* Location */}
          <div className="space-y-1 px-4 sm:space-y-0 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 sm:py-5">
            <div>
              <label
                htmlFor="location"
                className="block text-lg font-medium text-gray-900 sm:mt-px sm:pt-2"
              >
                Location
              </label>
            </div>
            <div className="sm:col-span-2">{location}</div>
          </div>

          {/* How to apply */}
          <div className="space-y-1 px-4 sm:space-y-0 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 sm:py-5">
            <div>
              <label
                htmlFor="howtoApply"
                className="block text-lg font-medium text-gray-900 sm:mt-px sm:pt-2"
              >
                How to apply
              </label>
            </div>
            <div className="sm:col-span-2">
              <div
                className="mb-8 w-full max-w-full"
                dangerouslySetInnerHTML={{ __html: howtoApply }}
              />
              {renderApplyButton()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
