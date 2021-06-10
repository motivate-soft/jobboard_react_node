import React from "react";

const Home = React.lazy(() => import("../pages/Home/Home"));

export const routes = [
  // { path: "/", exact: true, name: "Home" },
  { path: "/", name: "Home", component: Home },
];
