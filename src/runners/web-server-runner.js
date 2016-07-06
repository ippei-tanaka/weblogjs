import co from 'co';
import { mongoDriver, mongoDbBaseOperator } from 'simple-odm'
import webServerBuilder from '../web-server/web-server-builder';

const setupMongoDriver = (arg) =>
{
    mongoDriver.setUp({
        host: arg.dbHost,
        port: arg.dbPort,
        database: arg.dbName
    })
};

const start = ({
    webHost, webPort,
    dbHost, dbPort, dbName,
    adminDir, publicDir,
    webpageRoot, adminApiRoot, publicApiRoot,
    sessionSecret, staticPath}) => co(function* ()
{
    setupMongoDriver({dbHost, dbPort, dbName});

    const server = webServerBuilder.build({
        webHost, webPort,
        adminDir, publicDir,
        webpageRoot, adminApiRoot, publicApiRoot,
        sessionSecret, staticPath
    });

    yield server.start();
});

export default Object.freeze({start});