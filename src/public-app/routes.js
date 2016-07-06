import React from "react";
import ReactDOM from "react-dom";
import { Route, IndexRoute } from 'react-router';
import Wrapper from "./containers/wrapper";
import Multiple from "./containers/multiple";
import Single from "./containers/single";
import NotFound from "./containers/not-found";

const onEnterHandler = (_callback, store, actions) =>
{
    if (!store || !actions)
    {
        return null;
    }

    return (...args) =>
    {
        const transition = args[0];
        const replace = args[1];
        const callback = args[2];
        _callback({transition, replace, callback, store, actions, params: transition.params});
    }
};

export default ({store, actions} = {}) =>
{
    const multipleOnEnterHandler = onEnterHandler(Multiple.onEnterRoute.bind(Multiple.WrappedComponent), store, actions);
    const singleOnEnterHandler = onEnterHandler(Single.onEnterRoute.bind(Single.WrappedComponent), store, actions);

    return (
        <Route path="/" component={Wrapper}>
            <IndexRoute component={Multiple} onEnter={multipleOnEnterHandler}/>
            <Route path="(page/:page)" component={Multiple} onEnter={multipleOnEnterHandler}/>
            <Route path="(category/:category)(/)(page/:page)" component={Multiple} onEnter={multipleOnEnterHandler}/>
            <Route path="(tag/:tag)(/)(page/:page)" component={Multiple} onEnter={multipleOnEnterHandler}/>
            <Route path="post/:id/:slug" component={Single} onEnter={singleOnEnterHandler}/>
            <Route path="*" component={NotFound}/>
        </Route>
    )
}

