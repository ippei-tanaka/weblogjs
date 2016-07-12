import co from 'co';
import { mongoDriver, mongoDbBaseOperator } from 'simple-odm'
import UserModel from '../models/user-model';
import BlogModel from '../models/blog-model';
import SettingModel from '../models/setting-model';

const setupMongoDriver = ({host, port, database}) =>
{
    mongoDriver.setUp({host, port, database})
};

const dropDatabase = ({host, port, database}) => co(function* ()
{
    setupMongoDriver({host, port, database});
    yield mongoDbBaseOperator.dropDatabase();

    /*WeblogJS.init({
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

    process.on('uncaughtException', (error) => console.log(error.stack));*/
});

const removeAllDocuments = ({host, port, database}) => co(function* ()
{
    setupMongoDriver({host, port, database});
    yield mongoDbBaseOperator.removeAllDocuments();
});

const createUser = ({host, port, database}, {email, password, display_name, slug}) => co(function* ()
{
    setupMongoDriver({host, port, database});
    const model = new UserModel({email, password, display_name, slug});
    yield model.save();
});

const createBlog = ({host, port, database}, {name, slug, posts_per_page}) => co(function* ()
{
    setupMongoDriver({host, port, database});

    const model = new BlogModel({name, slug, posts_per_page});
    yield model.save();

    yield SettingModel.setSetting({
        front_blog_id: model.id
    })
});

export default Object.freeze({removeAllDocuments, dropDatabase, createUser, createBlog});