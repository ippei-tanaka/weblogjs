import WeblogJS from '../app';
import co from 'co';

WeblogJS.init({
    webPort: 3001,
    sessionSecret: "asdfasd9DSAISD",
    internalWebPort: 3002
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