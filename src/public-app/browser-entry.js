import React from "react";
import ReactDOM from "react-dom";
import { Router, browserHistory } from 'react-router'
import { Provider } from 'react-redux';
import reducers from './reducers';
import createStore from '../redux-store/create-store'
import createActions from '../redux-store/create-actions';
import bareActions from './actions/index';
import publicRoutes from './routes';

const preloadedState = window.__PRELOADED_STATE__;
const store = createStore(reducers, preloadedState);
const siteInfo = store.getState().publicSiteInfo.toJS();
const PUBLIC_DIR = siteInfo.webpageRootForPublic;
const actions = createActions(store, bareActions);

document.addEventListener("DOMContentLoaded", () =>
    ReactDOM.render(
        <Provider store={store}>
            <Router history={browserHistory}>
                {publicRoutes({root: PUBLIC_DIR, store, actions})}
            </Router>
        </Provider>,
        document.getElementById('AppContainer')
    ));

