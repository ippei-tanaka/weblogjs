import WeblogJS from '../src/index';
import co from 'co';

const config = {
    webPort: 3000
};

WeblogJS.setConfig(config);

co(function* () {
    yield WeblogJS.startWebServer();

    const c = WeblogJS.getConfig();
    console.log("");
    console.log("Web Server started...");
    console.log(`Go to the public page: ${c.webProtocol}://${c.webHost}:${c.webPort}/${c.publicDir}`);
    console.log(`Or, go to the admin page: ${c.webProtocol}://${c.webHost}:${c.webPort}/${c.adminDir}`);

}).catch(e => {
    console.error(e);
});