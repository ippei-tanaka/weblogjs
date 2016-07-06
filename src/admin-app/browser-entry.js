import React from "react";
import ReactDOM from "react-dom";
import { Router, browserHistory } from 'react-router'
import { Provider } from 'react-redux';
import reducers from './reducers';
import createStore from '../redux-store/create-store';
import adminRoutes from './routes';
require('./styles/main.scss');

const ENV = process.env.WEBLOG_WEBPACK_ENV;
const ADMIN_DIR = ENV.webpage_root + ENV.admin_dir;
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
