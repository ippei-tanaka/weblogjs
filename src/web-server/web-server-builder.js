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
import publicLayoutBuilder from '../public-app/layout-builder';

import RestfulApiAdminRouter from '../routers/restful-api-admin-router';
import RestfulApiPublicRouter from '../routers/restful-api-public-router';
import PassportManager from '../passport-manager';

const build = ({
    webHost,
    webPort,

    webpackDevServer = false,
    webpackDevServerHost,
    webpackDevServerPort,

    adminDir,
    publicDir,
    webpageRoot,

    adminApiRoot,
    publicApiRoot,

    sessionSecret,
    staticPath}) => {

    const webpageRouter = new WebpageRouter({
        basePath: webpageRoot
    });

    const AdminLayout = adminLayoutBuilder.build({
        title: "WeblogJS Admin",
        webpackDevServer,
        webpackDevServerHost,
        webpackDevServerPort
    });

    const adminRenderer = new WebpageRenderer({Layout: AdminLayout});

    const adminHookRunner = new WebpackRouteHookRunner ({
        reducers: adminReducers,
        actions: adminActions
    });

    const adminHandler = webpageRouteHandlerBuilder.build({
        basePath: webpageRoot,
        renderer: adminRenderer,
        routes: adminRoutes({root: path.resolve(webpageRoot, adminDir)}),
        hookRunner: adminHookRunner
    });

    webpageRouter.setHandler(path.resolve(webpageRoot, adminDir, "."), adminHandler);
    webpageRouter.setHandler(path.resolve(webpageRoot, adminDir, "*"), adminHandler);

    const PublicLayout = publicLayoutBuilder.build({
        title: "WeblogJS Public",
        webpackDevServer,
        webpackDevServerHost,
        webpackDevServerPort
    });

    const pubicRenderer = new WebpageRenderer({Layout: PublicLayout});

    const publicHookRunner = new WebpackRouteHookRunner ({
        reducers: publicReducers,
        actions: publicActions
    });

    const publicHandler = webpageRouteHandlerBuilder.build({
        basePath: webpageRoot,
        renderer: pubicRenderer,
        routes: publicRoutes({root: path.resolve(webpageRoot, publicDir)}),
        hookRunner: publicHookRunner
    });

    webpageRouter.setHandler(path.resolve(webpageRoot, publicDir, "*"), publicHandler);

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