import WeblogJS from '../src';

WeblogJS.setConfig({webPort: 3001}).startWebServer().then(() => {
    console.log("Web Server started...");
}).catch(e => {
    console.error(e);
});