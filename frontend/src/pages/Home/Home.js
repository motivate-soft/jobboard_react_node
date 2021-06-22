import React, { useState } from "react";
import JosPostPreview from "../../components/JosPostPreview/JosPostPreview";
import SideOverlay from "../../components/Shared/SideOverlay/SideOverlay";
import JobPostForm from "../../components/JobPostForm/JobPostForm";
import JobListTable from "../../components/JobList/JobListTable";
import JobDetail from "../../components/JobDetail/JobDetail";

export default function Home() {
  const [isJobpostOpened, setIsJobpostOpened] = useState(false);
  const [isJobdetailOpened, setIsJobdetailOpened] = useState(false);
  const [selectedJobId, setSelectedJobId] = useState(null);

  function handleClick(id) {
    console.log("handleClick", id);
    setIsJobdetailOpened(true);
    setSelectedJobId(id);
  }

  return (
    <div className="relative flex flex-col h-screen pt-20 bg-gray-100">
      <button
        type="submit"
        className="mb-10 mr-auto ml-10  py-2 px-4 inline-flex font-sans justify-center border border-transparent shadow-sm text-lg font-medium rounded-md text-white bg-indigo-500 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        onClick={() => setIsJobpostOpened(true)}
      >
        Post a Job
      </button>
      <JobListTable onClickRow={handleClick} />
      <SideOverlay
        className="w-screen max-w-4xl relative border-l border-gray-200"
        open={isJobdetailOpened}
        setOpen={setIsJobdetailOpened}
      >
        <JobDetail
          jobId={selectedJobId}
          open={isJobdetailOpened}
          setOpen={setIsJobdetailOpened}
        />
      </SideOverlay>
      <SideOverlay
        className="w-screen max-w-3xl relative border-l border-gray-200"
        open={isJobpostOpened}
        setOpen={setIsJobpostOpened}
      >
        <JobPostForm open={isJobpostOpened} setOpen={setIsJobpostOpened} />
      </SideOverlay>
      <JosPostPreview open={isJobpostOpened} />
    </div>
  );
}
