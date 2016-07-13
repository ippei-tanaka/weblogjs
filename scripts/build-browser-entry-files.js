import WeblogJS from '../src/index';
import co from 'co';

co(function* () {
    yield WeblogJS.buildBrowserEntryFiles();
}).catch(e => {
    console.error(e);
});