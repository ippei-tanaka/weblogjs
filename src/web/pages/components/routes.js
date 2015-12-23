import React from "react";
import ReactDOM from "react-dom";
import { Route, IndexRoute } from 'react-router';
import Router from 'react-router-component';
import App from "./app";
import Admin from "./app/admin";
import DashBoard from "./app/admin/dashboard";
//import Login from "./app/login";
//import Logout from "./app/logout";


/*
var requireAuth = (nextState, replaceState) => {
    //transition.to('/login');
    //callback();
    //console.log(nextState);
    //console.log(replaceState);
    //replaceState(null, '/login');h
    replaceState({nextPathname: nextState.location.pathname});
};
*/

export default (
    <Route path="/" component={App}>
        <Route path="admin" component={Admin}>
            <IndexRoute component={DashBoard} />
        </Route>
    </Route>
);