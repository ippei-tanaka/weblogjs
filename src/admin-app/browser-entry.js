import React from "react";
import ReactDOM from "react-dom";
import { Router, browserHistory } from 'react-router'
import { Provider } from 'react-redux';
import reducers from './reducers';
import createStore from '../redux-store/create-store';
import adminRoutes from './routes';

const store = createStore(reducers);

document.addEventListener("DOMContentLoaded", () =>
    ReactDOM.render(
        <Provider store={store}>
            <Router history={browserHistory}>
                {adminRoutes}
            </Router>
        </Provider>,
        document.getElementById('AppContainer')
    ));
