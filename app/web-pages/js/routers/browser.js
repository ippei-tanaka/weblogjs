import React from "react";
import ReactDOM from "react-dom";
import { appRoutes } from './routes';
import { Router } from 'react-router'
import createBrowserHistory from 'history/lib/createBrowserHistory';
import { Provider } from 'react-redux';
import store from '../stores/app-store';
import DevTools from '../containers/dev-tools';
const history = createBrowserHistory();
require('../../sass/admin/main.scss');


ReactDOM.render(
    <Provider store={store}>
        <div>
            <Router history={history}>
                {appRoutes}
            </Router>
            <DevTools />
        </div>
    </Provider>,
    document.getElementById('App')
);