import WeblogJS from '../src/index';
import co from 'co';

co(function* () {
    yield WeblogJS.dropDatabase();
    yield WeblogJS.createAdmin();
    yield WeblogJS.createDefaultBlog();
    process.exit();
}).catch(error => {
    console.error(error);
    process.exit(error);
});