import configFile from './config.json';
import WeblogJS from '../app';
import co from 'co';

WeblogJS.init({
    dbHost: configFile.database_host,
    dbPort: configFile.database_port,
    dbName: configFile.database_name,
    webHost: configFile.web_server_host,
    webPort: configFile.web_server_port,
    apiRoot: configFile.restful_api_root,
    sessionSecret: configFile.session_secret,
    internalWebHost: configFile.internal_web_server_host,
    internalWebPort: configFile.internal_web_server_port,
    internalApiRoot: configFile.internal_restful_api_root
});

const admin = Object.freeze({
    email: configFile.admin_email,
    password: configFile.admin_password,
    display_name: "Admin",
    slug: 'admin'
});

co(function* () {
    yield WeblogJS.webServer.start();
    yield WeblogJS.internalWebServer.start();
    yield WeblogJS.dbSettingOperator.dropDatabase();
    yield WeblogJS.dbSettingOperator.createIndexes();
    yield WeblogJS.dbSettingOperator.removeAllDocuments();
    yield WeblogJS.createUser(admin);
    console.log("Web Server has started...");
}).catch((error) => {
    console.error(error);
});