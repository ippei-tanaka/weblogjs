import { createStore, applyMiddleware, combineReducers, compose } from 'redux';
import promiseMiddleWare from '../middlewares/promise-middleware';
import functionMiddleWare from '../middlewares/function-middleware';
import DevTools from '../containers/dev-tools';
import userReducer from '../reducers/user-reducer';
import authReducer from '../reducers/auth-reducer';


const PRODUCTION_MODE = process.env.NODE_ENV === 'production'; // Configured in package.json

const reducer = combineReducers({
    user: userReducer,
    auth: authReducer
});

const enhancers = [applyMiddleware(functionMiddleWare, promiseMiddleWare)];

/*
if (!PRODUCTION_MODE) {
    enhancers.push(DevTools.instrument());
}
*/

const enhancer = compose.apply(compose, enhancers);

const finalCreateStore = enhancer(createStore);

export default finalCreateStore(reducer);