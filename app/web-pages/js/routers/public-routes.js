import React from "react";
import ReactDOM from "react-dom";
import { Route, IndexRoute } from 'react-router';
import Public from "../containers/app/public";
import Single from "../containers/app/public/single";

const routes = (
    <Route path="/" component={Public}>
        <Route path=":short_id/:slug" component={Single}  />
    </Route>
);

export default routes;