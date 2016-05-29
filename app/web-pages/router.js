import React from 'react';
import ReactDOMServer from 'react-dom/server';
import { Provider } from 'react-redux';
import { match, RoutingContext } from 'react-router';
import adminRoutes from './js/routers/admin-routes';
import publicRoutes from './js/routers/public-routes';
import AdminHtmlLayout from './js/components/admin-html-layout';
import PublicHtmlLayout from './js/components/public-html-layout';
import store from './js/stores/app-store';
import actions from './js/actions';
import express from "express";
import co from 'co';
import path from 'path';

const FAVICON_DIR = path.resolve(__dirname, './favicons/favicon.ico');
const STATIC_DIR = path.resolve(__dirname, './static');

const OK = 200;
const FOUND = 302;
const NOT_FOUND = 404;
const ERROR = 500;

const adminHtmlContainer = ReactDOMServer.renderToStaticMarkup(<AdminHtmlLayout />);
const publicHtmlContainer = ReactDOMServer.renderToStaticMarkup(<PublicHtmlLayout />);

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

const createHtml = (renderProps, htmlContainer) => co(function* () {

    const components = renderProps.components;
    const component = components[components.length - 1].WrappedComponent;
    let title = "Weblog JS";

    if (component.prepareForPreRendering)
    {
        const _actions = {};
        for (let actionName of Object.keys(actions)) {
            _actions[actionName] = (...args) => {
                return actions[actionName](...args)(store.dispatch, store.getState);
            }
        }
        const data = yield component.prepareForPreRendering({store, actions: _actions});
        title = data.title;
    }

    const content = ReactDOMServer.renderToString(
        <Provider store={store}>
            <RoutingContext {...renderProps} />
        </Provider>
    );

    let html = htmlContainer.replace("[TITLE_PLACE_HOLDER]", title);
    html = html.replace("[CONTENT_PLACE_HOLDER]", content);
    html = "<!DOCTYPE html>" + html;

    return html;
});

export default class WebpageRouter {

    constructor(basePath) {
        this._basePath = basePath;
        this._router = express.Router();
        this._router.get('*', this._handler.bind(this));
    }

    _handler(request, response) {
        co(function* () {
            const location = this._basePath + request.url;

            let htmlContainer = publicHtmlContainer;
            let result = yield routing({routes: publicRoutes, location});

            if (result.statusCode === NOT_FOUND) {
                result = yield routing({routes: adminRoutes, location});
                htmlContainer = adminHtmlContainer;
            }

            const { statusCode, data } = result;

            if (statusCode === OK) {
                createHtml(data, htmlContainer).then((html) => response.status(OK).send(html));
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