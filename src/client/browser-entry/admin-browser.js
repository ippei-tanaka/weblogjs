import React from "react";
import ReactDOM from "react-dom";
import { Router, browserHistory } from 'react-router'
import { Provider } from 'react-redux';
import reducers from '../../views/reducers';
import createStore from '../../views/stores/create-store';
import adminRoutes from '../../routers/webpage-admin-routes';
import { getEnv } from '../../env-variables';
require('../../views/sass/admin/main.scss');

const ENV = process.env.WEBLOG_WEBPACK_ENV || getEnv();

const pathResolve = (path1, path2) => {
    return path1 + path2;
};

const ADMIN_DIR = pathResolve(ENV.webpage_root, ENV.admin_dir);
const preloadedState = window.__PRELOADED_STATE__;
const store = createStore(reducers, preloadedState);

document.addEventListener("DOMContentLoaded", () =>
    ReactDOM.render(
        <Provider store={store}>
            <Router history={browserHistory}>
                {adminRoutes(ADMIN_DIR)}
            </Router>
        </Provider>,
        document.getElementById('AppContainer')
    ));
