import { Suspense, useState } from "react";

import AppSidebar from "./AppSidebar";
import Sidebar from "./Sidebar";
import AppTopbar from "./AppTopbar";
import Loader from "../../components/Shared/Loader/Loader";
import { Switch } from "react-router-dom";
import { Redirect } from "react-router-dom";
import routes from "../../routes/adminRoutes";
import PrivateRoute from "../../components/Shared/PrivateRoute/PrivateRoute";

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="h-screen flex overflow-hidden bg-white">
      <AppSidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      {/* Main column */}
      <div className="flex flex-col w-0 flex-1 overflow-hidden">
        <AppTopbar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        <main className="flex-1 relative z-0 overflow-y-auto focus:outline-none">
          <Suspense fallback={<Loader />}>
            <Switch>
              {routes.map((route, idx) => {
                return route.component ? (
                  <PrivateRoute
                    key={idx}
                    path={route.path}
                    exact={route.exact}
                    name={route.name}
                    component={route.component}
                  />
                ) : null;
              })}
              <Redirect from="/admin" to="/admin/dashboard" />
            </Switch>
          </Suspense>
        </main>
      </div>
    </div>
  );
}
