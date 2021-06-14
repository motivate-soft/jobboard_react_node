import React from "react";
import { useSelector } from "react-redux";
import JosListCard from "./JobListCard";

export default function JobList() {
  const { items } = useSelector((state) => state.job);
  console.log("joblist", items);
  return (
    <React.Fragment>
      {
        <div className="container mx-auto">
          {items.map((job, index) => (
            <JosListCard key={index} job={job} />
          ))}
        </div>
      }
    </React.Fragment>
  );
}
