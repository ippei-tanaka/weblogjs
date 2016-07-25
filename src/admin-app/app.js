import express from 'express';
import config from '../config';
import path from 'path';

import React from 'react';
import ReactDOMServer from 'react-dom/server';
import { Provider } from 'react-redux';
import { RouterContext } from 'react-router';
import reactRouteFind from '../react-router/react-route-find';
import adminRoutes from './routes';
import Layout from './layout';
import createStore from '../redux-store/create-store';
import reducers from './reducers/index';
import {OK, FOUND, NOT_FOUND, ERROR} from '../constants/status-codes';

const adminSiteApp = express();

// Register admin site static path
adminSiteApp.use(express.static(path.resolve(__dirname, './bundle')));

// Register configured static paths
const _staticPaths = config.getValue('adminSiteStaticPaths') || [];
const staticPaths = Array.isArray(_staticPaths) ? _staticPaths : [_staticPaths];
for (const staticPath of staticPaths) {
    adminSiteApp.use(express.static(staticPath));
}

// Setup routes
adminSiteApp.use((request, response) => {
    reactRouteFind({routes: adminRoutes, location: request.originalUrl}).then(result => {
        const statusCode = result.statusCode;
        if (statusCode === OK) {
            const htmlString = ReactDOMServer.renderToStaticMarkup(
                <Layout>
                    <Provider store={createStore(reducers)}>
                        <RouterContext {...result.renderProps} />
                    </Provider>
                </Layout>
            );
            response.status(OK).send("<!DOCTYPE html>" + htmlString);
        } else if (statusCode === ERROR) {
            response.status(ERROR).send(result.error);
        } else if (statusCode === FOUND) {
            response.status(FOUND).redirect(result.redirectLocation);
        } else if (statusCode === NOT_FOUND) {
            response.status(ERROR).send("Not Found");
        }
    });
});

export default adminSiteApp;