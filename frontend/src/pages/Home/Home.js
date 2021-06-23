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
    <div className="relative flex flex-col min-h-screen pt-20 bg-gray-100">
      <div className="container mx-auto">
        <button
          type="submit"
          className="btn-indigo mr-auto mb-12"
          onClick={() => setIsJobpostOpened(true)}
        >
          Post a Job
        </button>
      </div>

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
