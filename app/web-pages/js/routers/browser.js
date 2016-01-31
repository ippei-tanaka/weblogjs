import React from "react";
import ReactDOM from "react-dom";
import { appRoutes } from './routes';
import { Router } from 'react-router'
import createBrowserHistory from 'history/lib/createBrowserHistory';
import { Provider } from 'react-redux';
import store from '../stores/app-store';
//import AppContainer from '../containers/app-container';
//import { syncHistory, routeReducer } from 'react-router-redux';
/*
import { createStore, applyMiddleware, combineReducers, compose } from 'redux';
import promiseMiddleWare from '../middlewares/promise-middleware';
import functionMiddleWare from '../middlewares/function-middleware';
import userReducer from '../reducers/user-reducer';
import authReducer from '../reducers/auth-reducer';
*/

require('../../sass/admin/main.scss');


const history = createBrowserHistory();
//const middleware = syncHistory(history);
/*
const reducer = combineReducers({
    users: userReducer,
    auth: authReducer
});
const finalCreateStore = applyMiddleware(functionMiddleWare, promiseMiddleWare)(createStore);
const store = finalCreateStore(reducer);
*/
//middleware.listenForReplays(store);

/*
 const finalCreateStore = compose(
 applyMiddleware(middleware),
 DevTools.instrument()
 )(createStore);
 */


ReactDOM.render(
    <Provider store={store}>
        <Router history={history}>
            {appRoutes}
        </Router>
    </Provider>,
    document.getElementById('App')
);