import React from "react";
import ReactDOM from "react-dom";
import { Router, browserHistory } from 'react-router'
import { Provider } from 'react-redux';
import reducers from '../../app/views/reducers';
import createStore from '../../app/views/stores/create-store';
import adminRoutes from '../../app/routers/webpage-admin-routes';

require('../../app/views/sass/admin/main.scss');

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
