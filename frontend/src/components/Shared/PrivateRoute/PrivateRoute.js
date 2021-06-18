import React from "react";
import { Redirect, Route } from "react-router-dom";

export default function PrivateRoute({ component: Component, ...rest }) {
  console.log(
    'PrivateRoute->localStorage.getItem("token")',
    localStorage.getItem("token")
  );
  return (
    <Route
      {...rest}
      render={(props) =>
        localStorage.getItem("token") ? (
          <Component {...props} />
        ) : (
          <Redirect
            to={{ pathname: "/admin/login", state: { from: props.location } }}
          />
        )
      }
    />
  );
}
