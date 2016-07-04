import express from 'express';
import logger from 'morgan';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import expressSession from 'express-session';

const buildExpressApp = ({session, PassportManager, adminApiRouter, publicApiRouter, webpageRouter}) =>
{
    const expressApp = express();

    //expressApp.use(logger('dev'));
    expressApp.use(bodyParser.json());
    expressApp.use(bodyParser.urlencoded({extended: false}));
    expressApp.use(cookieParser());
    expressApp.use(session);

    if (PassportManager)
    {
        expressApp.use(PassportManager.passport.initialize());
        expressApp.use(PassportManager.passport.session());
    }

    if (adminApiRouter)
    {
        expressApp.use(adminApiRouter.basePath, adminApiRouter.router);
    }

    if (publicApiRouter)
    {
        expressApp.use(publicApiRouter.basePath, publicApiRouter.router);
    }

    if (webpageRouter)
    {
        expressApp.use(express.static(webpageRouter.staticDir));
        expressApp.use(webpageRouter.basePath, webpageRouter.router);
    }

    return expressApp;
};

export default class WebServer {

    constructor (
        {
            host, port, sessionSecret,
            webpageRouter, apiRouter,
            publicApiRouter, PassportManager}
    )
    {
        this._host = host;
        this._port = port;
        this._instance = null;
        this._expressApp = buildExpressApp({
            session: expressSession({
                secret: sessionSecret,
                resave: false,
                saveUninitialized: false
            }),
            PassportManager,
            adminApiRouter: apiRouter,
            publicApiRouter,
            webpageRouter
        });
    }

    start ()
    {
        return new Promise((resolve, reject) =>
        {
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
}