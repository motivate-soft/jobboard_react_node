import React, { useState } from "react";
import SideOverlay from "../../components/SideOverlay/SideOverlay";
import JobPostForm from "./../../components/JobPostForm/JobPostForm";

export default function Home() {
  const [isJobpostOpened, setIsJobpostOpened] = useState(true);

  return (
    <div>
      <button
        type="submit"
        className="inline-flex font-sans justify-center py-2 px-4 border border-transparent shadow-sm text-lg font-medium rounded-md text-white bg-orange hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        onClick={() => setIsJobpostOpened(true)}
      >
        Post a Job
      </button>
      <SideOverlay open={isJobpostOpened} setOpen={setIsJobpostOpened}>
        <JobPostForm open={isJobpostOpened} setOpen={setIsJobpostOpened} />
      </SideOverlay>
    </div>
  );
}
