import express from 'express';
import logger from 'morgan';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import expressSession from 'express-session';

export default class WebServer {

    constructor({
        host, port, sessionSecret,
        webpageRouter, apiRouter,
        publicApiRouter, PassportManager})
    {
        this._host = host;
        this._port = port;
        this._instance = null;
        this._session = expressSession({
            secret: sessionSecret,
            resave: false,
            saveUninitialized: false
        });
        this._webpageRouter = webpageRouter;
        this._apiRouter = apiRouter;
        this._publicApiRouter = publicApiRouter;
        this._PassportManager = PassportManager;
        this._expressApp = this._buildExpressApp();
    }

    start() {
        return new Promise((resolve, reject) => {
            this._instance = this._expressApp.listen(
                this._port,
                this._host,
                error => !error ? resolve() : reject(error)
            );
        });
    }

    /*
    stop() {
        return new Promise((resolve, reject) => {
            if (!this._instance) {
                resolve();
                return;
            }

            this._instance.close(error =>
                !error ? resolve() : reject(error));
        });
    }
    */

    _buildExpressApp() {
        const expressApp = express();

        //expressApp.use(logger('dev'));
        expressApp.use(bodyParser.json());
        expressApp.use(bodyParser.urlencoded({extended: false}));
        expressApp.use(cookieParser());
        expressApp.use(this._session);

        if (this._PassportManager) {
            expressApp.use(this._PassportManager.passport.initialize());
            expressApp.use(this._PassportManager.passport.session());
        }

        if (this._apiRouter) {
            expressApp.use(this._apiRouter.basePath, this._apiRouter.router);
        }

        if (this._publicApiRouter) {
            expressApp.use(this._publicApiRouter.basePath, this._publicApiRouter.router);
        }

        if (this._webpageRouter) {
            expressApp.use(express.static(this._webpageRouter.staticDir));
            expressApp.use(this._webpageRouter.basePath, this._webpageRouter.router);
        }

        return expressApp;
    }
}