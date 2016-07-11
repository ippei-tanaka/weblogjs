import React from "react";
import ReactDOM from "react-dom";
import { Router, browserHistory } from 'react-router'
import { Provider } from 'react-redux';
import reducers from './reducers';
import createStore from '../redux-store/create-store'
import createActions from '../redux-store/create-actions';
import bareActions from './actions';
import publicRoutes from './routes';

require('./styles/main.scss');

const ENV = process.env.WEBLOG_WEBPACK_ENV || {};
const PUBLIC_DIR = ENV.webpageRootForPublic;
const API_BASE = `${ENV.webProtocol}://${ENV.webHost}:${ENV.webPort}${ENV.publicApiRoot}`;
const preloadedState = window.__PRELOADED_STATE__;
const store = createStore(reducers, preloadedState);

const _actions = {};
for (const key of Object.keys(bareActions))
{
    _actions[key] = (arg = {}) => {
        arg.apiRoot = API_BASE;
        return bareActions[key](arg);
    }
}

const actions = createActions(store, _actions);

document.addEventListener("DOMContentLoaded", () =>
    ReactDOM.render(
        <Provider store={store}>
            <Router history={browserHistory}>
                {publicRoutes({root: PUBLIC_DIR, store, actions})}
            </Router>
        </Provider>,
        document.getElementById('AppContainer')
    ));