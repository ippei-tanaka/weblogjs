import { createStore, applyMiddleware, combineReducers, compose } from 'redux';
import promiseMiddleWare from '../middlewares/promise-middleware';
import functionMiddleWare from '../middlewares/function-middleware';
import userReducer from '../reducers/user-reducer';
import categoryReducer from '../reducers/category-reducer';
import blogReducer from '../reducers/blog-reducer';
import postReducer from '../reducers/post-reducer';
import settingReducer from '../reducers/setting-reducer';
import authReducer from '../reducers/auth-reducer';
import transactionReducer from '../reducers/transaction-reducer';
//import DevTools from '../containers/dev-tools';

//const DEVELOPMENT_MODE = process.env.WEBLOG_ENV === 'development';

const reducer = combineReducers({
    user: userReducer,
    category: categoryReducer,
    blog: blogReducer,
    post: postReducer,
    setting: settingReducer,
    auth: authReducer,
    transaction: transactionReducer
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