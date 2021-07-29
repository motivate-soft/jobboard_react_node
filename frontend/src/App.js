import React, { Fragment, Suspense } from "react";
import { BrowserRouter, Route, Redirect, Switch } from "react-router-dom";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import { ToastContainer } from "react-toastify";
import Loader from "./components/Shared/Loader/Loader";
import AdminLayout from "./containers/admin/AdminLayout";
import DefaultLayout from "./containers/user/DefaultLayout";

const Login = React.lazy(() => import("./pages/Auth/Login"));
const Register = React.lazy(() => import("./pages/Auth/Register"));

const stripePromise = loadStripe(
  process.env.REACT_APP_STRIPE_API_KEY ||
    "pk_test_51JFgV1FWtCTRj7rqw7hWBoGqqBxxJO5LcgvUzKZfRqUfCljEQ2wIYgAkE95o3W8VZIsY2nr6Bi6hNWlmp53J2IPH00L4ZCD9P5"
);

function App() {
  return (
    <Elements stripe={stripePromise}>
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
              <Route
                path="/"
                render={(props) => <DefaultLayout {...props} />}
              />
              <Redirect to="/" />
            </Switch>
          </Suspense>
        </BrowserRouter>
      </Fragment>
    </Elements>
  );
}

export default App;
