import React from "react";
import ReactDOM from "react-dom";
import { Router, browserHistory } from 'react-router'
import { Provider } from 'react-redux';
import reducers from './reducers';
import createStore from '../redux-store/create-store';
import adminRoutes from './routes';

require('./styles/main.scss');
require('./styles/font-awesome/scss/font-awesome.scss');

const preloadedState = window.__PRELOADED_STATE__;
const store = createStore(reducers, preloadedState);
const root = store.getState().adminSiteInfo.get('webpageRootForAdmin');

document.addEventListener("DOMContentLoaded", () =>
    ReactDOM.render(
        <Provider store={store}>
            <Router history={browserHistory}>
                {adminRoutes({root})}
            </Router>
        </Provider>,
        document.getElementById('AppContainer')
    ));
