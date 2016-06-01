import React from "react";
import ReactDOM from "react-dom";
import { Router } from 'react-router'
import { Provider } from 'react-redux';
import createBrowserHistory from 'history/lib/createBrowserHistory';
import reducers from './js/reducers';
import createStore from './js/stores/create-store';
import adminRoutes from './js/routers/admin-routes';

const history = createBrowserHistory();
require('./sass/admin/main.scss');

const preloadedState = window.__PRELOADED_STATE__;
const store = createStore(reducers, preloadedState);

document.addEventListener("DOMContentLoaded", () =>
    ReactDOM.render(
        <Provider store={store}>
            <Router history={history}>
                {adminRoutes}
            </Router>
        </Provider>,
        document.getElementById('AppContainer')
    ));
