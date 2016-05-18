import express from 'express';
import favicon from 'serve-favicon';
import logger from 'morgan';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import expressSession from 'express-session';
import PassportManager from '../passport-manager';

export default class WebServer {

    constructor({
        host, port, sessionSecret,
        webpageRouter, apiRouter}) {
        this._host = host;
        this._port = port;
        this._instance = null;
        this._sessionSecret = sessionSecret;
        this._webpageRouter = webpageRouter;
        this._apiRouter = apiRouter;
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
        const session = expressSession({
            secret: this._sessionSecret,
            resave: false,
            saveUninitialized: false
        });

        expressApp.use(favicon(this._webpageRouter.faviconDir));

        //expressApp.use(logger('dev'));
        expressApp.use(bodyParser.json());
        expressApp.use(bodyParser.urlencoded({extended: false}));
        expressApp.use(cookieParser());

        expressApp.use(session);

        expressApp.use(PassportManager.passport.initialize());
        expressApp.use(PassportManager.passport.session());

        // Restful API
        expressApp.use(this._apiRouter.basePath, this._apiRouter.router);

        // Static Files in pages dir
        expressApp.use(express.static(this._webpageRouter.staticDir));

        // Web Pages
        expressApp.use(this._webpageRouter.basePath, this._webpageRouter.router);

        return expressApp;
    }
}