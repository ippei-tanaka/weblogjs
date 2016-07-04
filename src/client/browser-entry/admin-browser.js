import React from "react";
import ReactDOM from "react-dom";
import { Router, browserHistory } from 'react-router'
import { Provider } from 'react-redux';
import reducers from '../../views/reducers';
import createStore from '../../views/stores/create-store';
import adminRoutes from '../../routers/webpage-admin-routes';
import path from 'path';
import { getEnv } from '../../env-variables';

const ENV = process.env.WEBLOG_WEBPACK_ENV || getEnv();
const ADMIN_DIR = path.resolve(ENV.webpage_root, ENV.admin_dir);

require('../../views/sass/admin/main.scss');

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
