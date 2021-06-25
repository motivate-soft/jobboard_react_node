import React, { Fragment, useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Dialog, Transition } from "@headlessui/react";
import { XIcon } from "@heroicons/react/outline";
import jobApi from "../../service/jobApi";
import Loader from "../Shared/Loader/Loader";

export default function JobDetail(props) {
  const { jobId, open, setOpen } = props;
  const [job, setJob] = useState(null);

  useEffect(() => {
    try {
      if (jobId) {
        fetchJobDetail();
      }
    } catch (error) {
      console.log("JobDetail->fetchJobDetail", error);
    }
  }, [jobId]);

  async function fetchJobDetail() {
    try {
      console.log("JobDetail->fetchJobDetail->jobId", jobId);
      const { data } = await jobApi.retrieve(jobId);
      console.log("JobDetail->fetchJobDetail->success", data);
      setJob(data);
    } catch (error) {
      console.log("JobDetail->fetchJobDetail->error", error);
    }
  }

  function renderApplyButton(job) {
    if (job.applyEmail && job.applyEmail !== "") {
      return (
        <a
          className="button action-apply btn-indigo"
          href={`mailto:${job.applyEmail}?subject=New applicant`}
          target="_blank"
          rel="nofollow"
          className="bg-indigo-500 text-white mb-auto font-sans justify-center py-2 px-10 border border-transparent shadow-sm text-lg font-medium rounded-md"
        >
          Apply
        </a>
      );
    }

    if (job.applyUrl && job.applyUrl !== "") {
      return (
        <a
          href={job.applyUrl}
          target="_blank"
          className="bg-indigo-500 text-white mb-auto font-sans justify-center py-2 px-10 border border-transparent shadow-sm text-lg font-medium rounded-md"
        >
          Apply
        </a>
      );
    }
  }

  function renderDialogTitle() {
    if (!job)
      return (
        <Dialog.Title className="text-2xl text-center font-bold text-gray-900">
          Job detail
        </Dialog.Title>
      );

    return (
      <Dialog.Title className="text-2xl text-center font-bold text-gray-900">
        {job.company.name} is hiring a {job.position}
      </Dialog.Title>
    );
  }

  function renderContent() {
    if (!job) return <Loader />;

    const {
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
      isShowLogo,
      isBlastEmail,
      isHighlight,
      highlightColor,
      isStickyDay,
      stickyDuration,
      status,
      company,
      createdAt,
      updatedAt,
    } = job;

    return (
      <Fragment>
        {/* Divider container */}
        <div className="py-6 space-y-6 sm:py-0 sm:space-y-0 sm:divide-y sm:divide-gray-200">
          {/* Job description */}
          <div className="space-y-1 px-4 sm:space-y-0 sm:grid sm:px-6 sm:py-5">
            <div dangerouslySetInnerHTML={{ __html: description }} />
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
              {renderApplyButton(job)}
            </div>
          </div>
        </div>
      </Fragment>
    );
  }

  return (
    <div className="h-full flex flex-col bg-white shadow-xl overflow-y-scroll">
      <div className="flex-1 pb-20">
        {/* Header */}
        <div className="px-4 py-6 bg-gray-50 sm:px-6">
          <div className="flex items-start justify-between space-x-3">
            <div className="space-y-1">{renderDialogTitle()}</div>
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
        {renderContent()}
      </div>
    </div>
  );
}
