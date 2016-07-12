import WeblogJS from '../src/index';
import co from 'co';

console.log("Starting initialization...");

const config = WeblogJS.getConfig();

co(function* () {
    console.log(`Dropping database: ${config.dbName} ...\n`);
    yield WeblogJS.dropDatabase();

    console.log(`Creating admin account...\n`);
    yield WeblogJS.createAdmin();

    console.log(`Creating an initial blog...\n`);
    yield WeblogJS.createDefaultBlog();

    console.log(`Initialization Done.\n`);

    process.exit();
}).catch(error => {
    console.error(error);
    process.exit(error);
});