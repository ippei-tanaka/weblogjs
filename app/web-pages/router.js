import React from 'react'
import ReactDOMServer from 'react-dom/server'
import { Provider } from 'react-redux'
import { match, RoutingContext } from 'react-router'
import { appRoutes as routes } from './js/routers/routes'
import HtmlLayout from './js/components/html-layout'
import store from './js/stores/app-store'
import express from "express"
import co from 'co'
import path from 'path'


const FAVICON_DIR = path.resolve(__dirname, './favicons/favicon.ico');
const STATIC_DIR = path.resolve(__dirname, './static');


var routing = ({location, response}) =>

    match({routes, location}, (error, redirectLocation, renderProps) => co(function* () {
        if (error) {
            response.status(500).send(error.message);
        } else if (redirectLocation) {
            response.redirect(302, redirectLocation.pathname);
        } else if (renderProps) {
            //const component = renderProps.components[renderProps.components.length - 1].WrappedComponent;

            //if (component.fetchData) yield component.fetchData({store});

            const content = ReactDOMServer.renderToString(
                <Provider store={store}>
                    <RoutingContext {...renderProps} />
                </Provider>
            );

            let html = ReactDOMServer.renderToStaticMarkup(<HtmlLayout />);

            html = html.replace("[CONTENT_PLACE_HOLDER]", content);

            response.status(200).send("<!DOCTYPE html>" + html);
        } else {
            response.status(404).send("Not Found!");
        }
    }));


export default class WebpageRouter {

    constructor(basePath) {
        this._basePath = basePath;
        this._router = express.Router();
        this._router.get('*', this._handler.bind(this));
    }

    _handler(request, response) {
        const location = this._basePath + request.url;
        routing({location, response});
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