import WeblogJS from '../index';
import co from 'co';

export const run = () => new Promise((resolve, reject) => {
    WeblogJS.init({
        sessionSecret: "asdfasd9DSAISD"
    });

    const admin = Object.freeze({
        email: "t@t.com",
        password: "tttttttt",
        display_name: "Admin",
        slug: 'admin'
    });

    co(function* () {
        console.log("Dropping the database...");
        yield WeblogJS.dropDatabase();

        console.log("Removing all the documents in the database...");
        yield WeblogJS.removeAllDocuments();

        console.log("Creating the admin account...");
        yield WeblogJS.createUser(admin);

        console.log("Finished the initialization.");
        process.exit();
    }).catch((error) => {
        console.error(error);
    });

    process.on('uncaughtException', (error) => console.log(error.stack));
});