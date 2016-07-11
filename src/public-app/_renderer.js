import co from 'co';
import React from 'react';
import ReactDOMServer from 'react-dom/server';
import { Provider } from 'react-redux';
import { RouterContext, match } from 'react-router';
import reducers from './reducers';
import createStore from '../redux-store/create-store'
import createActions from '../redux-store/create-actions';
import bareActions from './actions';
import publicRoutes from './routes';
import PublicLayout from './layout';
import {OK, FOUND, NOT_FOUND, ERROR} from '../constants/status-codes';

const executeHookOfPrepareForPreRendering = ({renderProps}) => co(function* ()
{
    const { components, params } = renderProps;
    const store = createStore(reducers);
    const actions = createActions(store, bareActions);

    let title = "Weblog JS";
    let data = {};
    let statusCode = OK;

    for (const component of components)
    {
        if (component && component.prepareForPreRendering)
        {
            data = yield component.prepareForPreRendering({store, actions, params, parentData: data});

            if (data && data.title)
            {
                title = data.title;
            }

            if (data && data.statusCode)
            {
                statusCode = data.statusCode;
            }
        }
    }

    return {title, store, statusCode};
});

const renderHtmlLayout = (component) =>
{
    let html = ReactDOMServer.renderToStaticMarkup(component);
    return "<!DOCTYPE html>" + html;
};

const routing = ({routes, location}) => new Promise((resolve, reject) =>
{
    match({routes, location}, (error, redirectLocation, renderProps) =>
    {
        if (renderProps)
        {
            resolve({statusCode: OK, data: renderProps})
        }
        else if (error)
        {
            resolve({statusCode: ERROR, data: error});
        }
        else if (redirectLocation)
        {
            resolve({statusCode: FOUND, data: redirectLocation.pathname});
        }
        else
        {
            resolve({statusCode: NOT_FOUND, data: null});
        }
    });
});

export default ({location}) => co(function* ()
{
    const { statusCode, data } = yield routing({routes: publicRoutes(), location});

    if (statusCode === OK)
    {
        const renderProps = data;
        const result = yield executeHookOfPrepareForPreRendering({renderProps});
        return renderHtmlLayout(
            <PublicLayout title={result.title} preloadedState={result.store.getState()}>
                <Provider store={result.store}>
                    <RouterContext {...renderProps} />
                </Provider>
            </PublicLayout>
        );
    }
    else
    {
        return Promise.reject({statusCode, data});
    }
});
