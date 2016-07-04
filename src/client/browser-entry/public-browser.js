import React from "react";
import ReactDOM from "react-dom";
import { Router, browserHistory } from 'react-router'
import { Provider } from 'react-redux';
import reducers from '../../app/views/reducers';
import createStore from '../../app/views/stores/create-store';
import createActions from '../../app/views/stores/create-actions';
import publicRoutes from '../../app/routers/webpage-public-routes';

require('../../app/views/sass/public/main.scss');

const preloadedState = window.__PRELOADED_STATE__;
const store = createStore(reducers, preloadedState);
const actions = createActions(store);

document.addEventListener("DOMContentLoaded", () =>
    ReactDOM.render(
        <Provider store={store}>
            <Router history={browserHistory}>
                {publicRoutes({store, actions})}
            </Router>
        </Provider>,
        document.getElementById('AppContainer')
    ));