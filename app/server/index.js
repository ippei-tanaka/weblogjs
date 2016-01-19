import express from 'express';
import favicon from 'serve-favicon';
import logger from 'morgan';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import expressSession from 'express-session';
import path from 'path';
import WebpageRouter from '../web-pages/router';
import RestfulApiRouter from '../restful-api/router';
import ConfigManager from '../config-manager';
import PassportManager from './passport-manager';
import API from '../api';


const WEBPAGE_ROOT_PATH = '/';
const RESTFUL_API_ROOT_PATH = '/api/v1';


var passport = PassportManager.passport;
var expressApp = express();
var webServer;
var config = ConfigManager.load();
var faviconDir = path.resolve(__dirname, '../../src/web/pages/favicons/favicon.ico');
var staticDir = path.resolve(__dirname, '../../src/web/pages/static');
var webpageRouter = new WebpageRouter(WEBPAGE_ROOT_PATH);
var restfulApiRouter = new RestfulApiRouter(RESTFUL_API_ROOT_PATH);
var session = expressSession({
    secret: config.session_secret,
    resave: false,
    saveUninitialized: false
});



expressApp.use(favicon(faviconDir));
expressApp.use(logger('dev'));
expressApp.use(bodyParser.json());
expressApp.use(bodyParser.urlencoded({extended: false}));
expressApp.use(cookieParser());

expressApp.use(session);

expressApp.use(passport.initialize());
expressApp.use(passport.session());

// Restful API
expressApp.use(RESTFUL_API_ROOT_PATH, restfulApiRouter.router);

// Static Files in pages dir
expressApp.use(express.static(staticDir));

// Web Pages
expressApp.use(WEBPAGE_ROOT_PATH, webpageRouter.router);


/**
 * @returns {Promise}
 */
var startServer = () => new Promise((resolve, reject) => {
    API.db.connect()
        .then(() => {
            webServer = expressApp.listen(config.web_server_port, config.web_server_host,
                (err) => {
                    !err ? resolve() : reject(err);
                });
        });
});

/**
 * @returns {Promise}
 */
var stopServer = () => new Promise((resolve, reject) => {
    if (webServer) {
        webServer.close((err) => {
            if (!err) {
                API.db.disconnect()
                    .then(resolve)
                    .catch(reject);
            }
        });
    }
});


module.exports = {
    startServer,
    stopServer
};