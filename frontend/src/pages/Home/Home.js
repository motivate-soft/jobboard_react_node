import React, { useState } from "react";
import SideOverlay from "../../components/Shared/SideOverlay/SideOverlay";
import JobListTable from "../../components/JobList/JobListTable";
import JobDetail from "../../components/JobDetail/JobDetail";
import { Link } from "react-router-dom";

export default function Home() {
  const [isJobdetailOpened, setIsJobdetailOpened] = useState(false);
  const [selectedJobId, setSelectedJobId] = useState(null);

  function handleClick(id) {
    console.log("Home->handleTableRowClick", id);
    setIsJobdetailOpened(true);
    setSelectedJobId(id);
  }

  return (
    <div className="relative flex flex-col min-h-screen pt-20 bg-gray-100">
      <div className="container mx-auto">
        <Link to="/buy-single" className="btn-indigo mr-auto mb-12">
          Post a Job
        </Link>
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
    </div>
  );
}
