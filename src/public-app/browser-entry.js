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

const preloadedState = window.__PRELOADED_STATE__;
const store = createStore(reducers, preloadedState);
const actions = createActions(store, bareActions);

document.addEventListener("DOMContentLoaded", () =>
    ReactDOM.render(
        <Provider store={store}>
            <Router history={browserHistory}>
                {publicRoutes({store, actions})}
            </Router>
        </Provider>,
        document.getElementById('AppContainer')
    ));