import path from 'path';

import WebServer from './web-server';

import WebpageRouter from '../routers/webpage-router';
import WebpageRenderer from './webpage-renderer';
import WebpackRouteHookRunner from './webpage-route-hook-runner';
import webpageRouteHandlerBuilder from './webpage-route-handler-builder';
import adminRoutes from '../admin-app/routes';
import adminReducers from '../admin-app/reducers/index';
import adminActions from '../admin-app/actions/index';
import adminLayoutBuilder from '../admin-app/layout-builder';
import publicRoutes from '../public-app/routes';
import publicReducers from '../public-app/reducers/index';
import publicActions from '../public-app/actions/index';

import RestfulApiAdminRouter from '../routers/restful-api-admin-router';
import RestfulApiPublicRouter from '../routers/restful-api-public-router';
import PassportManager from '../passport-manager';

const build = ({
    webHost, webPort,
    adminDir, publicDir,
    webpageRoot, adminApiRoot, publicApiRoot,
    sessionSecret, staticPath}) => {

    const webpageRouter = new WebpageRouter({
        basePath: webpageRoot
    });

    const AdminLayout = adminLayoutBuilder.build({
        title: "WeblogJS Admin",
        webpackDevServer: false
    });

    const adminRenderer = new WebpageRenderer({Layout: AdminLayout});

    const adminHookRunner = new WebpackRouteHookRunner ({
        reducers: adminReducers,
        actions: adminActions
    });

    const adminHandler = webpageRouteHandlerBuilder.build({
        basePath: webpageRoot,
        renderer: adminRenderer,
        routes: adminRoutes({root: webpageRoot + adminDir}),
        hookRunner: adminHookRunner
    });

    webpageRouter.setHandler(path.resolve(webpageRoot, adminDir, "."), adminHandler);
    webpageRouter.setHandler(path.resolve(webpageRoot, adminDir, "*"), adminHandler);
    //webpageRouter.setHandler(path.resolve(webpageRoot, publicDir, "*"), publicHandler);
    //this._router.get(path.resolve(webpageRoot, adminDir, "."), adminHandler());
    //this._router.get(path.resolve(webpageRoot, adminDir, "*"), adminHandler());
    //this._router.get(path.resolve(webpageRoot, publicDir, "*"), publicHandler(webpageRoot));


    const adminApiRouter = new RestfulApiAdminRouter({
        basePath: adminApiRoot
    });

    const publicApiRouter = new RestfulApiPublicRouter({
        basePath: publicApiRoot
    });

    return new WebServer({
        host: webHost,
        port: webPort,
        sessionSecret,
        webpageRouter,
        adminApiRouter,
        publicApiRouter,
        PassportManager,
        staticPath
    });
};

export default Object.freeze({build});