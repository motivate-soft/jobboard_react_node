import React from "react";

const Home = React.lazy(() => import("../pages/Home/Home"));
const Buybundle = React.lazy(() => import("../pages/Buybundle/Buybundle"));

export const routes = [
  // { path: "/", exact: true, name: "Home" },
  { path: "/", exact: true, name: "Home", component: Home },
  {
    path: "/buy-bundle",
    name: "Buy bundle",
    component: Buybundle,
  },
];
