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

const start = (args) => co(function* ()
{
    const {dbHost, dbPort, dbName} = args;
    setupMongoDriver({dbHost, dbPort, dbName});

    const server = webServerBuilder.build(args);

    yield server.start();
});

export default Object.freeze({start});