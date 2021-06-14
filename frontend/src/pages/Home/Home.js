import React, { useState } from "react";
import JosPostPreview from "../../components/JosPostPreview/JosPostPreview";
import SideOverlay from "../../components/SideOverlay/SideOverlay";
import JobPostForm from "../../components/JobPostForm/JobPostForm";
import JobList from "../../components/JobList/JobList";

export default function Home() {
  const [isJobpostOpened, setIsJobpostOpened] = useState(true);

  return (
    <div className="relative flex flex-col h-screen pt-20">
      <button
        type="submit"
        className="mb-10 mr-auto ml-10  py-2 px-4 inline-flex font-sans justify-center border border-transparent shadow-sm text-lg font-medium rounded-md text-white bg-indigo-500 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        onClick={() => setIsJobpostOpened(true)}
      >
        Post a Job
      </button>
      <JobList />
      <SideOverlay open={isJobpostOpened} setOpen={setIsJobpostOpened}>
        <JobPostForm open={isJobpostOpened} setOpen={setIsJobpostOpened} />
      </SideOverlay>
      <JosPostPreview open={isJobpostOpened} />
    </div>
  );
}
