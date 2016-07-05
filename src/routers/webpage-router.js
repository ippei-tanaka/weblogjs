import co from 'co';
import path from 'path';
import url from 'url';
import { Router } from "express";
import React from 'react';
import ReactDOMServer from 'react-dom/server';
import { Provider } from 'react-redux';
import { RouterContext } from 'react-router';
import { match } from 'react-router';
import reducers from '../views/reducers';
import createStore from '../views/stores/create-store';
import createActions from '../views/stores/create-actions';
import AdminHtmlLayout from '../views/layouts/admin-html-layout';
import PublicHtmlLayout from '../views/layouts/public-html-layout';
import publicRoutes from './webpage-public-routes';
import {OK, FOUND, NOT_FOUND, ERROR} from './../constants/status-codes';

export const executeHookOfPrepareForPreRendering = ({renderProps}) => co(function* ()
{
    const { components, params } = renderProps;
    const store = createStore(reducers);
    const actions = createActions(store);

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

export const renderHtmlLayout = (component) =>
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

const adminHandler = (request, response) => co(function* ()
{
    response.status(OK).send(
        renderHtmlLayout(<AdminHtmlLayout title="Weblog JS Admin"/>)
    );
});

const publicHandler = (basePath) => (request, response) => co(function* ()
{
    const location = url.resolve(basePath, request.url);
    const { statusCode, data } = yield routing({routes: publicRoutes(), location});

    if (statusCode === OK)
    {
        const renderProps = data;
        const result = yield executeHookOfPrepareForPreRendering({renderProps});
        const htmlString = renderHtmlLayout(
            <LayoutComponent title={result.title} preloadedState={result.store.getState()}>
                <Provider store={result.store}>
                    <RouterContext {...renderProps} />
                </Provider>
            </LayoutComponent>
        );
        response.status(result.statusCode).send(htmlString);
    }
    else if (statusCode === FOUND)
    {
        response.redirect(FOUND, data.pathname);
    }
    else if (statusCode === ERROR)
    {
        response.status(ERROR).send(data.message);
    }
    else if (statusCode === NOT_FOUND)
    {
        response.status(NOT_FOUND).send("Not Found!");
    }
});

export default class WebpageRouter {

    constructor ({adminDir, publicDir, webpageRoot})
    {
        this._basePath = webpageRoot;
        this._router = Router();
        this._router.get(path.resolve(webpageRoot, adminDir, "."), adminHandler);
        this._router.get(path.resolve(webpageRoot, adminDir, "*"), adminHandler);
        this._router.get(path.resolve(webpageRoot, publicDir, "*"), publicHandler(webpageRoot));
    }

    get basePath ()
    {
        return this._basePath;
    }

    get router ()
    {
        return this._router;
    }
}