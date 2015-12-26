import React from "react";
import ReactDOM from "react-dom";
import { appRoutes } from './routes';
import { Router } from 'react-router'
import createBrowserHistory from 'history/lib/createBrowserHistory'

ReactDOM.render(
    <Router history={createBrowserHistory()}>
        {appRoutes}
    </Router>,
    document.getElementById('App')
);