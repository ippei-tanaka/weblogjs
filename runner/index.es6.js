import WeblogJS from '../app';
import co from 'co';

const WEBSERVER_PORT = process.env.WB_WSERVER_PORT;
const INTERNAL_WEBSERVER_PORT = process.env.WB_INTN_WSERVER_PORT;

WeblogJS.init({
    webPort: WEBSERVER_PORT,
    sessionSecret: "asdfasd9DSAISD",
    internalWebPort: INTERNAL_WEBSERVER_PORT
});

const admin = Object.freeze({
    email: "t@t.com",
    password: "tttttttt",
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