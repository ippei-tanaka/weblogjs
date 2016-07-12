import WeblogJS from '../src/index';
import co from 'co';

console.log("Building client entry files...");

co(function* () {
    yield WeblogJS.buildBrowserEntryFiles();
}).catch(e => {
    console.error(e);
});