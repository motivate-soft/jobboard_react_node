import React, { Component, Suspense } from "react";
import Header from "./Header";
import Footer from "./Footer";
import { routes } from "../routes.js/routes";
import { Switch, Route, Redirect } from "react-router-dom";
import Loader from "../components/Loader/Loader";

export default function DefaultLayout() {
  return (
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
  );
}
