import React from "react";
import ReactDOM from "react-dom";
import { Router } from 'react-router'
import { Provider } from 'react-redux';
import createBrowserHistory from 'history/lib/createBrowserHistory';
import reducers from './js/reducers';
import createStore from './js/stores/create-store';
import publicRoutes from './js/routers/public-routes';

const history = createBrowserHistory();
require('./sass/public/main.scss');

const preloadedState = window.__PRELOADED_STATE__;
const store = createStore(reducers, preloadedState);

document.addEventListener("DOMContentLoaded", () =>
    ReactDOM.render(
        <Provider store={store}>
            <Router history={history}>
                {publicRoutes}
            </Router>
        </Provider>,
        document.getElementById('AppContainer')
    ));