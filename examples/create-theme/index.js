var WeblogJS = require('../../').default;
var path = require('path');

WeblogJS.setConfig({
    webPort: 3005,
    staticPath: path.resolve(__dirname, "../../temp"),
    themeSrcDirPath: [path.resolve(__dirname, "./my-themes")]
});

WeblogJS.buildBrowserEntryFiles().then(() => {
    WeblogJS.startWebServer();
});