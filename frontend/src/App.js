import React from "react";
import { BrowserRouter, Route, Redirect, Switch } from "react-router-dom";
import DefaultLayout from "./layout/DefaultLayout";

function App() {
  return (
    <BrowserRouter>
      <Switch>
        <Route path="/" render={(props) => <DefaultLayout {...props} />} />

        <Redirect to="/" />
      </Switch>
    </BrowserRouter>
  );
}

export default App;
