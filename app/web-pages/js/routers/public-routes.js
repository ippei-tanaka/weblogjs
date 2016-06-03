import React from "react";
import ReactDOM from "react-dom";
import { Route, IndexRoute } from 'react-router';
import Index from "../containers/public/index";
import Wrapper from "../containers/public/wrapper";
import Single from "../containers/public/single";


const onEnterHandler = (_callback, store, actions) => {

    if (!store || !actions) {
        return null;
    }

    return (...args) => {
        const transition = args[0];
        const replace = args[1];
        const callback = args[2];
        _callback({ transition, replace, callback, store, actions, params: transition.params });
    }
};

export default ({store, actions} = {}) => {
    return (
        <Route path="/(category/:category)(tag/:tag)(/)(page/:page)" component={Wrapper}>
            <IndexRoute
                component={Index}
                onEnter={onEnterHandler(Index.onEnterRoute.bind(Index.WrappedComponent), store, actions)}
            />
            <Route path="post/:id/:slug"
                   component={Single}
                   onEnter={onEnterHandler(Single.onEnterRoute.bind(Single.WrappedComponent), store, actions)}/>
        </Route>
    )
}

