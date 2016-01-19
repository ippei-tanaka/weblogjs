import express from "express";
import co from 'co';
import path from 'path';
import ClientRouter from './components/router/server';


const FAVICON_DIR = path.resolve(__dirname, './favicons/favicon.ico');
const STATIC_DIR = path.resolve(__dirname, './static');


export default class WebpageRouter {

    constructor(basePath) {
        this._basePath = basePath;
        this._router = express.Router();
        this._router.get('*', this._handler.bind(this));
    }

    _handler(request, response) {
        var location = this._basePath + request.url;

        co(function* () {
            var ret = yield ClientRouter({location});
            var status = ret.status;
            var data = ret.data;

            if (status === 200) {
                response.status(status).send(data);
            } else if (status === 302) {
                response.redirect(status, data);
            } else if (status === 404) {
                response.status(status).send("Not Found!");
            }
        }).catch(error => {
            response.status(500).send(error.message);
        });
    }

    get basePath () {
        return this._basePath;
    }

    get router () {
        return this._router;
    }

    get faviconDir () {
        return FAVICON_DIR;
    }

    get staticDir () {
        return STATIC_DIR;
    }
}