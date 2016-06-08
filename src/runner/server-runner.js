import WeblogJS from '../app';
import co from 'co';

export const run = () => new Promise((resolve, reject) => {
    WeblogJS.init({
        sessionSecret: "asdfasd9DSAISD"
    });

    co(function* () {
        yield WeblogJS.webServer.start();
        console.log("Web Server has started...");
    }).catch((error) => {
        console.error(error);
    });

    process.on('uncaughtException', (error) => console.log(error.stack));

    resolve();
});