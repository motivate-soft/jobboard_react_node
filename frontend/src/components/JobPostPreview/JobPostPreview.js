import React from "react";
import { useJobPost } from "../../contexts/jobContext";

export default function JobPostPreview(props) {
  const { state: job } = useJobPost();

  return (
    <div className="grid grid-cols-6">
      <div className="col-span-1 mr-4 flex content-center items-center">
        {job.logo ? (
          <img src={job.logo} alt="company log" />
        ) : (
          <h4>Company Logo</h4>
        )}
      </div>
      <div className="col-span-3 flex flex-col">
        <h4>{job.companyName}</h4>
        <div className="grid grid-cols-6">
          <h4 className="font-bold text-2xl col-span-2">{job.position}</h4>
          <div className="flex flex-wrap col-span-4">
            {job.primaryTag && (
              <div className="mr-1 mb-auto px-1 rounded border-black border-2">
                {job.primaryTag}
              </div>
            )}

            {job.tags.map((tag, index) => (
              <div
                key={index}
                className="mr-1 mb-auto px-1 rounded border-black border-2"
              >
                {tag}
              </div>
            ))}
          </div>
        </div>
        <div>
          <div className="inline-flex p-1 bg-gray-200 rounded">
            {job.location}
          </div>
        </div>
      </div>
    </div>
  );
}
