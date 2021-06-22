import React from "react";
import Job from "../../../components/Admin/Job/Job";
import PageTitle from "../../../containers/admin/PageTitle";

export default function JobPage() {
  return (
    <div>
      <PageTitle title={"Job"} />
      <Job />
    </div>
  );
}
