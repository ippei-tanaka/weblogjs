import co from 'co';
import path from 'path';
import url from 'url';
import { Router } from "express";
import adminAppRender from '../admin-app/renderer';
import publicAppRender from '../public-app/renderer';
import {OK, FOUND, NOT_FOUND, ERROR} from './../constants/status-codes';

const adminHandler = (request, response) => co(function* ()
{
    const html = yield adminAppRender();
    response.status(OK).send(html);
}).catch(e => {
    console.log(e);
});

const publicHandler = (basePath) => (request, response) => co(function* ()
{
    const location = url.resolve(basePath, request.url);
    const html = yield publicAppRender(location);
    response.status(OK).send(html);
}).catch((reason = {}) =>
{
    const {statusCode, data} = reason;

    if (statusCode === FOUND)
    {
        response.redirect(FOUND, data.pathname);
        return;
    }

    if (statusCode === ERROR)
    {
        response.status(ERROR).send(data.message);
        return;
    }

    if (statusCode === NOT_FOUND)
    {
        response.status(NOT_FOUND).send("Not Found!");
        return;
    }

    throw reason;

}).catch(e => {
    console.log(e);
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