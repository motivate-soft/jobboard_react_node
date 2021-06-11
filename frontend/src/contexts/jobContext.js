import React, { useState, createContext, useContext } from "react";

export const JobContext = createContext();

const initialJob = {
  logo: "/images/default_logo.jpg",
  companyName: "Company",
  position: "Position",
  primaryTag: null,
  tags: [],
  location: "Worldwide",
};

const JobProvider = ({ children }) => {
  const [job, setJob] = useState(initialJob);

  return (
    <JobContext.Provider value={{ job, setJob }}>
      {children}
    </JobContext.Provider>
  );
};

export const useJob = () => useContext(JobContext);

export default JobProvider;
