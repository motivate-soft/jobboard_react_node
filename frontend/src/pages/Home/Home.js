import React, { useState } from "react";
import JosPostPreview from "../../components/JosPostPreview/JosPostPreview";
import SideOverlay from "../../components/SideOverlay/SideOverlay";
import JobProvider from "../../contexts/jobContext";
import JobPostForm from "./../../components/JobPostForm/JobPostForm";

export default function Home() {
  const [isJobpostOpened, setIsJobpostOpened] = useState(true);

  return (
    <JobProvider>
      <div className="relative flex h-screen">
        <button
          type="submit"
          className=" mb-auto inline-flex font-sans justify-center py-2 px-4 border border-transparent shadow-sm text-lg font-medium rounded-md text-white bg-orange hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          onClick={() => setIsJobpostOpened(true)}
        >
          Post a Job
        </button>
        <SideOverlay open={isJobpostOpened} setOpen={setIsJobpostOpened}>
          <JobPostForm open={isJobpostOpened} setOpen={setIsJobpostOpened} />
        </SideOverlay>
        <JosPostPreview />
      </div>
    </JobProvider>
  );
}
