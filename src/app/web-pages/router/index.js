import React from 'react';
import { match } from 'react-router';
import adminRoutes from '../web-app/routers/admin-routes';
import publicRoutes from '../web-app/routers/public-routes';
import AdminHtmlLayout from '../layouts/admin-html-layout';
import PublicHtmlLayout from '../layouts/public-html-layout';
import createHtml from './lib/create-html';
import express from "express";
import co from 'co';
import path from 'path';
import url from 'url';
import {OK, FOUND, NOT_FOUND, ERROR} from './lib/status-codes';

const STATIC_DIR = path.resolve(__dirname, "../../../client/static");

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
                createHtml(LayoutComponent, data)
                    .then(({html, statusCode}) => response.status(statusCode).send(html));
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

    get staticDir() {
        return STATIC_DIR;
    }
}