import path from 'path';

import WebServer from './web-server';

import WebpageRouter from '../routers/webpage-router';
import WebpageRenderer from './webpage-renderer';
import WebpackRouteHookRunner from './webpage-route-hook-runner';
import webpageRouteHandlerBuilder from './webpage-route-handler-builder';

import layoutBuilder from '../react-components/layout-builder';

import adminRoutes from '../admin-app/routes';
import adminReducers from '../admin-app/reducers/index';
import adminActions from '../admin-app/actions/index';

import publicRoutes from '../public-app/routes';
import publicReducers from '../public-app/reducers/index';
import publicActions from '../public-app/actions/index';

import RestfulApiAdminRouter from '../routers/restful-api-admin-router';
import RestfulApiPublicRouter from '../routers/restful-api-public-router';
import PassportManager from '../passport-manager';

const build = ({
    webProtocol,
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
    staticPath,

    bundleDirName,
    vendorJsFileName,
    adminJsFileName,
    adminCssFileName,
    publicJsFileName,

    themeDistDirName

    }) =>
{

    const webpageRouter = new WebpageRouter({
        basePath: webpageRoot
    });

    const AdminLayout = layoutBuilder.build({
        webpackDevServerHost,
        webpackDevServerPort,
        bundleDirName,
        vendorJsFileName: vendorJsFileName,
        jsFileName: adminJsFileName,
        cssFileName: adminCssFileName,
        needDevVendorJs: webpackDevServer,
        needDevJs: webpackDevServer,
        needCss: true,
        needVendorJs: !webpackDevServer,
        needJs: !webpackDevServer
    });

    const adminRenderer = new WebpageRenderer({Layout: AdminLayout});

    const adminHookRunner = new WebpackRouteHookRunner({
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

    const PublicLayout = layoutBuilder.build({
        webpackDevServerHost,
        webpackDevServerPort,
        bundleDirName,
        vendorJsFileName,
        jsFileName: publicJsFileName,
        //needDevVendorJs: false,
        //needDevJs: false,
        needDevVendorJs: webpackDevServer,
        needDevJs: webpackDevServer,
        needCss: false,
        needVendorJs: false,
        needJs: false
    });

    const pubicRenderer = new WebpageRenderer({Layout: PublicLayout});

    const publicHookRunner = new WebpackRouteHookRunner({
        reducers: publicReducers,
        actions: publicActions,
        state: {
            publicSiteInfo: {
                webpageRootForPublic: path.resolve(webpageRoot, publicDir),
                webProtocol,
                webHost,
                webPort,
                publicApiRoot,
                publicDir
            }
        }
    });

    const publicHandler = webpageRouteHandlerBuilder.build({
        basePath: webpageRoot,
        renderer: pubicRenderer,
        routes: publicRoutes({root: path.resolve(webpageRoot, publicDir)}),
        hookRunner: publicHookRunner
    });

    webpageRouter.setHandler(path.resolve(webpageRoot, publicDir, "."), publicHandler);
    webpageRouter.setHandler(path.resolve(webpageRoot, publicDir, "*"), publicHandler);

    const adminApiRouter = new RestfulApiAdminRouter({
        basePath: adminApiRoot,
        staticPath,
        themeDistDirName
    });

    const publicApiRouter = new RestfulApiPublicRouter({
        basePath: publicApiRoot,
        staticPath,
        themeDistDirName
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