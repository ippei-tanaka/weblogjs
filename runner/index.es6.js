import WeblogJS from '../app';
import co from 'co';

const WEBSERVER_PORT = process.env.WB_WSERVER_PORT;
const INTERNAL_WEBSERVER_PORT = process.env.WB_INTN_WSERVER_PORT;
const INIT = process.env.WEBLOG_ENV === 'init';

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
    if (INIT) {
        console.log("Dropping the database...");
        yield WeblogJS.dbSettingOperator.dropDatabase();

        console.log("Creating indexes for collections...");
        yield WeblogJS.dbSettingOperator.createIndexes();

        console.log("Removing all the documents in the database...");
        yield WeblogJS.dbSettingOperator.removeAllDocuments();

        console.log("Creating the admin account...");
        yield WeblogJS.createUser(admin);

        console.log("Finished the initialization.");
        process.exit();
    } else {
        yield WeblogJS.webServer.start();
        yield WeblogJS.internalWebServer.start();
        console.log("Web Server has started...");
    }
}).catch((error) => {
    console.error(error);
});