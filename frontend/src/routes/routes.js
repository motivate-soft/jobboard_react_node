import React from "react";

const Home = React.lazy(() => import("../pages/Home/Home"));
const Buybundle = React.lazy(() => import("../pages/Buybundle/Buybundle"));
const Buysingle = React.lazy(() => import("../pages/Buysingle/Buysingle"));

const routes = [
  // { path: "/", exact: true, name: "Home" },
  { path: "/", exact: true, name: "Home", component: Home },
  { path: "/buy-single", name: "Buy single", component: Buysingle },
  {
    path: "/buy-bundle",
    name: "Buy bundle",
    component: Buybundle,
  },
];

export default routes;
