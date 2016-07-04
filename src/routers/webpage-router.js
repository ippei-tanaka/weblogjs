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
        createHtmlLayoutAndStatus(PublicHtmlLayout, data)
            .then(({html, statusCode}) => response.status(statusCode).send(html));
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