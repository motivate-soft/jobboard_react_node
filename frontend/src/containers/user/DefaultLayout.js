import React, { Component, Suspense } from "react";
import Header from "./Header";
import Footer from "./Footer";
import { Switch, Route, Redirect } from "react-router-dom";
import Loader from "../../components/Shared/Loader/Loader";
import routes from "../../routes/routes";
import JobPostProvider from "../../contexts/jobContext";

export default function DefaultLayout() {
  return (
    <JobPostProvider>
      <React.Fragment>
        {/* <Header /> */}
        <Suspense fallback={<Loader />}>
          <Switch>
            {routes.map((route, idx) => {
              return route.component ? (
                <Route
                  key={idx}
                  path={route.path}
                  exact={route.exact}
                  name={route.name}
                  render={(props) => <route.component {...props} />}
                />
              ) : null;
            })}
            <Redirect from="/" to="/dashboard" />
          </Switch>
        </Suspense>
        <Footer />
      </React.Fragment>
    </JobPostProvider>
  );
}
