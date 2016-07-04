import { Router } from "express";
import co from 'co';
import path from 'path';
import url from 'url';
import React from 'react';
import { match } from 'react-router';
import publicRoutes from './webpage-public-routes';
import AdminHtmlLayout from '../views/layouts/admin-html-layout';
import PublicHtmlLayout from '../views/layouts/public-html-layout';
import {OK, FOUND, NOT_FOUND, ERROR} from './lib/status-codes';
import { createHtmlLayoutAndStatus, renderHtmlLayout } from './lib/create-html';
import { getEnv } from '../env-variables';

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

    constructor() {
        const ENV = getEnv();
        this._basePath = ENV.webpage_root;
        this._router = Router();
        this._router.get(path.resolve(ENV.webpage_root, ENV.admin_dir, "."), this._adminHandler.bind(this));
        this._router.get(path.resolve(ENV.webpage_root, ENV.admin_dir, "*"), this._adminHandler.bind(this));
        this._router.get(path.resolve(ENV.webpage_root, ENV.public_dir, "*"), this._publicHandler.bind(this));
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
        return getEnv().static_path;
    }
}