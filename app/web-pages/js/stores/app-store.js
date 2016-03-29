import { createStore, applyMiddleware, combineReducers, compose } from 'redux';
import promiseMiddleWare from '../middlewares/promise-middleware';
import functionMiddleWare from '../middlewares/function-middleware';
import userReducer from '../reducers/user-reducer';
import authReducer from '../reducers/auth-reducer';
import errorReducer from '../reducers/error-reducer';
//import DevTools from '../containers/dev-tools';

//const DEVELOPMENT_MODE = process.env.WEBLOG_ENV === 'development';

const reducer = combineReducers({
    user: userReducer,
    auth: authReducer,
    error: errorReducer
});

const enhancers = [applyMiddleware(functionMiddleWare, promiseMiddleWare)];

/*
if (DEVELOPMENT_MODE) {
    enhancers.push(DevTools.instrument());
}
*/

const enhancer = compose.apply(compose, enhancers);

const finalCreateStore = enhancer(createStore);

export default finalCreateStore(reducer);