import { createStore, applyMiddleware, combineReducers, compose } from 'redux';
import promiseMiddleWare from '../middlewares/promise-middleware';
import functionMiddleWare from '../middlewares/function-middleware';
import DevTools from '../containers/dev-tools';
import userReducer from '../reducers/user-reducer';
import authReducer from '../reducers/auth-reducer';


const reducer = combineReducers({
    user: userReducer,
    auth: authReducer
});

const enhancer = compose(
    // Middleware you want to use in development:
    applyMiddleware(functionMiddleWare, promiseMiddleWare),

    // Required! Enable Redux DevTools with the monitors you chose
    DevTools.instrument()//,

    // Optional. Lets you write ?debug_session=<key> in address bar to persist debug sessions
    //persistState(getDebugSessionKey())
);

const finalCreateStore = enhancer(createStore);

export default finalCreateStore(reducer);