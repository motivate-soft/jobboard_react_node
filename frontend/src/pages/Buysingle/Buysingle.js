import React, { useState } from "react";
import JobPostForm from "../../components/JobPostForm/JobPostForm";
import JobPostPreview from "../../components/JobPostPreview/JobPostPreview";
import PaymentForm from "../../components/PaymentForm/PaymentForm";

export default function Buysingle() {
  const [isJobpostOpened, setIsJobpostOpened] = useState(false);

  return (
    <div className="relative flex flex-col min-h-screen pt-20 bg-gray-100">
      <div className="container mx-auto">
        <JobPostForm />
      </div>
      <JobPostPreview />
      {/* <PaymentForm /> */}
    </div>
  );
}
