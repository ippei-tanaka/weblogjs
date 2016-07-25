import express from 'express';
import config from '../config';
import path from 'path';
import publicRoutes from './routes';

const publicSiteApp = express();

// Register public site static path
publicSiteApp.use(express.static(path.resolve(__dirname, './static')));

// Register configured static paths
const _staticPaths = config.getValue('publicSiteStaticPaths') || [];
const staticPaths = Array.isArray(_staticPaths) ? _staticPaths : [_staticPaths];
for (const staticPath of staticPaths) {
    publicSiteApp.use(express.static(staticPath));
}

// Setup routes
publicSiteApp.use(publicRoutes);

export default publicSiteApp;