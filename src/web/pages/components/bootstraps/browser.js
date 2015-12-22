import React from "react";
import ReactDOM from "react-dom";
import routes from '../routes';
import { Router } from 'react-router'
import createBrowserHistory from 'history/lib/createBrowserHistory'

ReactDOM.render(
    <Router history={createBrowserHistory()}>
        {routes}
    </Router>,
    document.getElementById('Content')
);