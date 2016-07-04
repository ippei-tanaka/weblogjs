import { createStore, applyMiddleware, compose } from 'redux';
import promiseMiddleWare from '../middlewares/promise-middleware';
import functionMiddleWare from '../middlewares/function-middleware';

const enhancers = [applyMiddleware(functionMiddleWare, promiseMiddleWare)];

const enhancer = compose.apply(compose, enhancers);

const finalCreateStore = enhancer(createStore);

export default finalCreateStore;