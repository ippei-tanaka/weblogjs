import WeblogJS from '../src/index';

const config = {
    webPort: 3001,
    webpackDevServer: true
};

WeblogJS.setConfig(config).startWebServer().then(() => {
    console.log("Web Server started...");
}).catch(e => {
    console.error(e);
});