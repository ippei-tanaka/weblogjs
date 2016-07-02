import React from 'react';
import { match } from 'react-router';
import publicRoutes from '../web-app/routers/public-routes';
import AdminHtmlLayout from '../layouts/admin-html-layout';
import PublicHtmlLayout from '../layouts/public-html-layout';
import { createHtmlLayoutAndStatus, renderHtmlLayout } from './lib/create-html';
import { ADMIN_DIR, PUBLIC_DIR } from '../web-app/constants/config'
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
        this._router.get(path.resolve(ADMIN_DIR, "*"), this._adminHandler.bind(this));
        this._router.get(path.resolve(PUBLIC_DIR, "*"), this._publicHandler.bind(this));
    }

    _adminHandler(request, response) {
        co(function* () {
            response.status(OK).send(
                renderHtmlLayout(<AdminHtmlLayout title="Weblog JS Admin" />)
            );
        }.bind(this));
    }

    _publicHandler(request, response) {
        co(function* () {
            const location = url.resolve(this._basePath, request.url);
            const { statusCode, data } = yield routing({routes: publicRoutes(), location});

            if (statusCode === OK) {
                createHtmlLayoutAndStatus(PublicHtmlLayout, data)
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