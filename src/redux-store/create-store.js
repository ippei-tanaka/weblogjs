import { createStore, applyMiddleware, compose } from 'redux';
import promiseMiddleWare from './promise-middleware';
import functionMiddleWare from './function-middleware';

const enhancers = [
    applyMiddleware(functionMiddleWare, promiseMiddleWare),
    typeof window === "object" && window !== null && window.devToolsExtension
        ? window.devToolsExtension() : f => f
];

const finalCreateStore = compose(...enhancers)(createStore);

export default finalCreateStore;