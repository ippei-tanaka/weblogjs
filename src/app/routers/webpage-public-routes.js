import React from "react";
import ReactDOM from "react-dom";
import { Route, IndexRoute } from 'react-router';
import Index from "../views/web-app/containers/public/index";
import Wrapper from "../views/web-app/containers/public/wrapper";
import Single from "../views/web-app/containers/public/single";
import NotFound from "../views/web-app/containers/public/not-found";


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

    const indexOnEnterHandler = onEnterHandler(Index.onEnterRoute.bind(Index.WrappedComponent), store, actions);

    return (
        <Route path="/" component={Wrapper}>
            <IndexRoute component={Index} onEnter={indexOnEnterHandler} />
            <Route path="(page/:page)" component={Index} onEnter={indexOnEnterHandler} />
            <Route path="(category/:category)(/)(page/:page)" component={Index} onEnter={indexOnEnterHandler} />
            <Route path="(tag/:tag)(/)(page/:page)" component={Index} onEnter={indexOnEnterHandler} />
            <Route path="post/:id/:slug"
                   component={Single}
                   onEnter={onEnterHandler(Single.onEnterRoute.bind(Single.WrappedComponent), store, actions)}/>
            <Route path="*" component={NotFound} />
        </Route>
    )
}

