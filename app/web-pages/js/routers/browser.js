import React from "react";
import ReactDOM from "react-dom";
import { appRoutes } from './routes';
import { Router } from 'react-router'
import createBrowserHistory from 'history/lib/createBrowserHistory';
import { Provider } from 'react-redux';
import store from '../stores/app-store';
import DevTools from '../containers/dev-tools';

const PRODUCTION_MODE = process.env.NODE_ENV === 'production'; // Configured in package.json
const history = createBrowserHistory();
require('../../sass/admin/main.scss');

ReactDOM.render(
    <Provider store={store}>
        <Router history={history}>
            {appRoutes}
        </Router>
    </Provider>,
    document.getElementById('App')
);
/*
ReactDOM.render(
    <Provider store={store}>
        <div>
            <Router history={history}>
                {appRoutes}
            </Router>
            { PRODUCTION_MODE ? null : <DevTools /> }
        </div>
    </Provider>,
    document.getElementById('App')
);
*/