import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import DragSlider from "../../components/JobPostDesign/DragSlider";
import JobPostDesign from "../../components/JobPostDesign/JobPostDesign";
import JosPostPreview from "../../components/JosPostPreview/JosPostPreview";
import { useJobPost } from "../../contexts/jobContext";

export default function Buybundle() {
  const { state, dispatch } = useJobPost();
  const { size, price } = state;

  useEffect(() => {
    dispatch({
      type: "RESET_JOB_BUNDLE",
    });
  }, []);

  return (
    <div className="flex flex-col container mx-auto px-4 pb-28">
      <Link
        to="/"
        className="ml-auto mb-10 inline-flex font-sans justify-center py-2 px-4 border border-transparent shadow-sm text-lg font-medium rounded-md text-white bg-indigo-500 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
      >
        Post a single Job
      </Link>
      <DragSlider />
      <div className="mt-20 mb-10">
        <JobPostDesign />
      </div>
      <button className="mx-auto mb-20 px-4 py-4 max-w-lg inline-flex font-sans text-3xl justify-center  border border-transparent shadow-sm font-medium rounded-xl text-white bg-indigo-500 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
        Buy{" "}<span>{size}</span>-jobs bundle — $<span>{price}</span>
      </button>
      <JosPostPreview />
    </div>
  );
}
