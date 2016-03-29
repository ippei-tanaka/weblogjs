import React from "react";
import ReactDOM from "react-dom";
import { Router } from 'react-router'
import { Provider } from 'react-redux';
import createBrowserHistory from 'history/lib/createBrowserHistory';
import store from '../stores/app-store';
import { appRoutes } from './routes';
//import DevTools from '../containers/dev-tools';

//const DEVELOPMENT_MODE = process.env.WEBLOG_ENV === 'development';
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
            { DEVELOPMENT_MODE ? <DevTools /> : null }
        </div>
    </Provider>,
    document.getElementById('App')
);
*/