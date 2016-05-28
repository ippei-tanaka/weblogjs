import React from "react";
import ReactDOM from "react-dom";
import { Route, IndexRoute } from 'react-router';
import Public from "../containers/app/public";

const routes = (
    <Route path="/" component={Public} />
);

export default routes;