import React from "react";
import ReactDOM from "react-dom";
import { Route, IndexRoute } from 'react-router';
import Index from "../containers/public/index";
import Wrapper from "../containers/public/wrapper";
import Single from "../containers/public/single";

const routes = (
    <Route path="/" component={Wrapper}>
        <IndexRoute component={Index}/>
        <Route path="p/:id/:slug" component={Single}  />
    </Route>
);

export default routes;