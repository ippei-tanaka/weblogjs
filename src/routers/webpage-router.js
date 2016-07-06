import path from 'path';
import { Router } from "express";

export default class WebpageRouter {

    constructor ({basePath})
    {
        this._basePath = basePath;
        this._router = Router();
    }

    setHandler (route, handler) {
        this._router.get(path.resolve(this._basePath, route), handler);
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