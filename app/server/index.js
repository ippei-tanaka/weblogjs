import express from 'express';
import favicon from 'serve-favicon';
import logger from 'morgan';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import expressSession from 'express-session';
import WebpageRouter from '../web-pages/router';
import RestfulApiRouter from '../restful-api/router';
import ConfigManager from '../config-manager';
import PassportManager from './passport-manager';
import API from '../api';



var passport = PassportManager.passport;
var expressApp = express();
var webServer;
var config = ConfigManager.load();
var webpageRouter = new WebpageRouter(config.web_page_root);
var restfulApiRouter = new RestfulApiRouter(config.restful_api_root);
var session = expressSession({
    secret: config.session_secret,
    resave: false,
    saveUninitialized: false
});



expressApp.use(favicon(webpageRouter.faviconDir));
expressApp.use(logger('dev'));
expressApp.use(bodyParser.json());
expressApp.use(bodyParser.urlencoded({extended: false}));
expressApp.use(cookieParser());

expressApp.use(session);

expressApp.use(passport.initialize());
expressApp.use(passport.session());

// Restful API
expressApp.use(config.restful_api_root, restfulApiRouter.router);

// Static Files in pages dir
expressApp.use(express.static(webpageRouter.staticDir));

// Web Pages
expressApp.use(config.web_page_root, webpageRouter.router);


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