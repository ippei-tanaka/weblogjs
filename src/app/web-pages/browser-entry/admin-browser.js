import React from "react";
import ReactDOM from "react-dom";
import { Router, browserHistory } from 'react-router'
import { Provider } from 'react-redux';
import reducers from '../web-app/reducers';
import createStore from '../web-app/stores/create-store';
import adminRoutes from '../web-app/routers/admin-routes';

require('./../sass/admin/main.scss');

const preloadedState = window.__PRELOADED_STATE__;
const store = createStore(reducers, preloadedState);

document.addEventListener("DOMContentLoaded", () =>
    ReactDOM.render(
        <Provider store={store}>
            <Router history={browserHistory}>
                {adminRoutes()}
            </Router>
        </Provider>,
        document.getElementById('AppContainer')
    ));
