import React from "react";
import ReactDOM from "react-dom";
import { Router } from 'react-router'
import { Provider } from 'react-redux';
import createBrowserHistory from 'history/lib/createBrowserHistory';
import store from './js/stores/app-store';
import adminRoutes from './js/routers/admin-routes';

const history = createBrowserHistory();
require('./sass/admin/main.scss');

ReactDOM.render(
    <Provider store={store}>
        <Router history={history}>
            {adminRoutes}
        </Router>
    </Provider>,
    document.getElementById('App')
);