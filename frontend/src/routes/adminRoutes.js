import React from "react";

const Dashboard = React.lazy(() => import("../pages/Admin/Dashboard"));
const Job = React.lazy(() => import("../pages/Admin/Job"));
const Profile = React.lazy(() => import("../pages/Admin/Account/Profile"));
const ChangePassword = React.lazy(() =>
  import("../pages/Admin/Account/ChangePassword")
);

const routes = [
  { path: "/admin/dashboard", name: "Dashboard", component: Dashboard },
  { path: "/admin/job", name: "Job", component: Job },

  { path: "/admin/account/profile", name: "Profile", component: Profile },
  {
    path: "/admin/account/password",
    name: "Password",
    component: ChangePassword,
  },
];

export default routes;
