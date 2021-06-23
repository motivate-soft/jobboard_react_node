import React from "react";
import Job from "../../../components/Admin/Job/Job";
import PageTitle from "../../../containers/admin/PageTitle";

export default function JobPage() {
  return (
    <div className="shadow bg-white border-b sm:rounded-lg">
      <PageTitle title={"Job"} />
      <Job />
    </div>
  );
}
