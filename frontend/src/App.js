import React, { Fragment, Suspense } from "react";
import { BrowserRouter, Route, Redirect, Switch } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import Loader from "./components/Shared/Loader/Loader";
import AdminLayout from "./containers/admin/AdminLayout";
import DefaultLayout from "./containers/user/DefaultLayout";

const Login = React.lazy(() => import("./pages/Auth/Login"));
const Register = React.lazy(() => import("./pages/Auth/Register"));

function App() {
  return (
    <Fragment>
      <BrowserRouter>
        <ToastContainer autoClose={3000} />
        <Suspense fallback={<Loader />}>
          <Switch>
            <Route path="/admin/login" component={Login} />
            <Route path="/admin/register" component={Register} />
            <Route
              path="/admin"
              render={(props) => <AdminLayout {...props} />}
            />

            <Route path="/" render={(props) => <DefaultLayout {...props} />} />
            <Redirect to="/" />
          </Switch>
        </Suspense>
      </BrowserRouter>
    </Fragment>
  );
}

export default App;
