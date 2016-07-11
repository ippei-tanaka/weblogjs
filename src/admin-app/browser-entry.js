import React from "react";
import ReactDOM from "react-dom";
import { Router, browserHistory } from 'react-router'
import { Provider } from 'react-redux';
import reducers from './reducers';
import createStore from '../redux-store/create-store';
import adminRoutes from './routes';
import { ADMIN_DIR } from './constants/config';
require('./styles/main.scss');

const preloadedState = window.__PRELOADED_STATE__;
const store = createStore(reducers, preloadedState);

document.addEventListener("DOMContentLoaded", () =>
    ReactDOM.render(
        <Provider store={store}>
            <Router history={browserHistory}>
                {adminRoutes({root: ADMIN_DIR})}
            </Router>
        </Provider>,
        document.getElementById('AppContainer')
    ));
