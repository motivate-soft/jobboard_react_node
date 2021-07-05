import React, { useState } from "react";
import JobPostForm from "../../components/JobPostForm/JobPostForm";

export default function Buysingle() {
  return (
    <div className="relative flex flex-col min-h-screen py-20 bg-gray-100">
      <div className="container mx-auto">
        <JobPostForm />
      </div>
    </div>
  );
}
