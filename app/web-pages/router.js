import React from 'react';
import ReactDOMServer from 'react-dom/server';
import { Provider } from 'react-redux';
import { match, RouterContext } from 'react-router';
import adminRoutes from './js/routers/admin-routes';
import publicRoutes from './js/routers/public-routes';
import AdminHtmlLayout from './js/components/admin-html-layout';
import PublicHtmlLayout from './js/components/public-html-layout';
import reducers from './js/reducers';
import createStore from './js/stores/create-store';
import createActions from './js/stores/create-actions';
import express from "express";
import co from 'co';
import path from 'path';
import url from 'url';

const FAVICON_DIR = path.resolve(__dirname, './favicons/favicon.ico');
const STATIC_DIR = path.resolve(__dirname, './static');

const OK = 200;
const FOUND = 302;
const NOT_FOUND = 404;
const ERROR = 500;

const routing = ({routes, location}) => new Promise((resolve, reject) => {
    match({routes, location}, (error, redirectLocation, renderProps) => {
        if (renderProps) {
            resolve({statusCode: OK, data: renderProps})
        } else if (error) {
            resolve({statusCode: ERROR, data: error});
        } else if (redirectLocation) {
            resolve({statusCode: FOUND, data: redirectLocation.pathname});
        } else {
            resolve({statusCode: NOT_FOUND, data: null});
        }
    });
});

const createHtml = (renderProps, LayoutComponent) => co(function* () {

    const { components, params } = renderProps;
    const store = createStore(reducers);
    const actions = createActions(store);

    let title = "Weblog JS";
    let data = {};

    for (const component of components)
    {
        if (component && component.prepareForPreRendering)
        {
            data = yield component.prepareForPreRendering({store, actions, params, parentData: data});

            if (data && data.title) {
                title = data.title;
            }
        }
    }

    let html = ReactDOMServer.renderToStaticMarkup(
        <LayoutComponent title={title} preloadedState={store.getState()}>
            <Provider store={store}>
                <RouterContext {...renderProps} />
            </Provider>
        </LayoutComponent>
    );

    html = "<!DOCTYPE html>" + html;

    return html;

}).catch(error => console.error(error.stack ? error.stack : error));

export default class WebpageRouter {

    constructor(basePath) {
        this._basePath = basePath;
        this._router = express.Router();
        this._router.get('*', this._handler.bind(this));
    }

    _handler(request, response) {
        co(function* () {
            const location = url.resolve(this._basePath, request.url);

            let LayoutComponent = AdminHtmlLayout;
            let result = yield routing({routes: adminRoutes(), location});

            if (result.statusCode === NOT_FOUND) {
                result = yield routing({routes: publicRoutes(), location});
                LayoutComponent = PublicHtmlLayout;
            }

            const { statusCode, data } = result;

            if (statusCode === OK) {
                createHtml(data, LayoutComponent).then((html) => response.status(OK).send(html));
            } else if (statusCode === FOUND) {
                response.redirect(FOUND, data.pathname);
            } else if (statusCode === ERROR) {
                response.status(ERROR).send(data.message);
            } else if (statusCode === NOT_FOUND) {
                response.status(NOT_FOUND).send("Not Found!");
            }

        }.bind(this));
    }

    get basePath() {
        return this._basePath;
    }

    get router() {
        return this._router;
    }

    get faviconDir() {
        return FAVICON_DIR;
    }

    get staticDir() {
        return STATIC_DIR;
    }
}