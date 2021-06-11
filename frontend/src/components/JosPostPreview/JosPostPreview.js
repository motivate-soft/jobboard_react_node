import React from "react";
import { useJob } from "../../contexts/jobContext";

export default function JosPostPreview(props) {
  const { job } = useJob();

  return (
    <div className="absolute left-0 right-0 bottom-0 px-10 py-4 border-t border-gray-200">
      <div className="grid grid-cols-6">
        <div className="col-span-1">
          <img src={job.logo} alt="company log" />
        </div>
        <div className="col-span-4 flex flex-col">
          <h4>{job.companyName}</h4>
          <div className="grid grid-cols-6">
            <h4 className="font-bold text-2xl col-span-2">{job.position}</h4>
            <div className="">
              {job.primaryTag && (
                <div className="inline-flex mr-1 mb-1 px-1 rounded border-black border-2">
                  {job.primaryTag}
                </div>
              )}

              {job.tags.map((tag, index) => (
                <div
                  key={index}
                  className="inline-flex mr-1 mb-1 px-1 rounded border-black border-2"
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
        <div className="col-span-1"></div>
      </div>
    </div>
  );
}
