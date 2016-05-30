import React from "react";
import ReactDOM from "react-dom";
import { Router } from 'react-router'
import { Provider } from 'react-redux';
import createBrowserHistory from 'history/lib/createBrowserHistory';
import store from './js/stores/app-store';
import publicRoutes from './js/routers/public-routes';

const history = createBrowserHistory();
require('./sass/public/main.scss');

document.addEventListener("DOMContentLoaded", () =>
    ReactDOM.render(
        <Provider store={store}>
            <Router history={history}>
                {publicRoutes}
            </Router>
        </Provider>,
        document.getElementById('AppContainer')
    ));