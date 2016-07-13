import WeblogJS from '../src/index';
import co from 'co';

const config = {
    webPort: 3000
};

WeblogJS.setConfig(config);

co(function* () {
    yield WeblogJS.startWebServer();
}).catch(e => {
    console.error(e);
});