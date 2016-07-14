import co from 'co';
import { mongoDriver, mongoDbBaseOperator } from 'simple-odm'
import UserModel from '../models/user-model';
import BlogModel from '../models/blog-model';
import SettingModel from '../models/setting-model';

const setupMongoDriver = ({dbHost, dbPort, dbName}) =>
{
    mongoDriver.setUp({
        host: dbHost,
        port: dbPort,
        database: dbName
    })
};

const dropDatabase = ({
    dbHost,
    dbPort,
    dbName}) => co(function* ()
{
    setupMongoDriver({dbHost, dbPort, dbName});
    yield mongoDbBaseOperator.dropDatabase();
});

const removeAllDocuments = ({
    dbHost,
    dbPort,
    dbName}) => co(function* ()
{
    setupMongoDriver({dbHost, dbPort, dbName});
    yield mongoDbBaseOperator.removeAllDocuments();
});

const createAdminUser = ({
    dbHost,
    dbPort,
    dbName,
    adminEmail,
    adminPassword,
    adminDisplayName,
    adminSlug}) => co(function* ()
{
    setupMongoDriver({dbHost, dbPort, dbName});
    const model = new UserModel({
        email: adminEmail,
        password: adminPassword,
        display_name: adminDisplayName,
        slug: adminSlug
    });
    yield model.save();
});

const createDefaultBlog = ({
    dbHost,
    dbPort,
    dbName,
    defaultBlogName,
    defaultBlogSlug,
    defaultBlogPostPerPage}) => co(function* ()
{
    setupMongoDriver({dbHost, dbPort, dbName});

    const model = new BlogModel({
        name: defaultBlogName,
        slug: defaultBlogSlug,
        posts_per_page: defaultBlogPostPerPage
    });
    yield model.save();

    yield SettingModel.setSetting({
        front_blog_id: model.id
    })
});

export default Object.freeze({removeAllDocuments, dropDatabase, createAdminUser, createDefaultBlog});