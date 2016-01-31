import { createStore, applyMiddleware, combineReducers, compose } from 'redux';
import promiseMiddleWare from '../middlewares/promise-middleware';
import functionMiddleWare from '../middlewares/function-middleware';
import userReducer from '../reducers/user-reducer';
import authReducer from '../reducers/auth-reducer';


const reducer = combineReducers({
    user: userReducer,
    auth: authReducer
});

const finalCreateStore = applyMiddleware(functionMiddleWare, promiseMiddleWare)(createStore);

export default finalCreateStore(reducer);