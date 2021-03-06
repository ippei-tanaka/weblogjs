import co from 'co';
import express from 'express';
import pluralize from 'pluralize';
import PassportManager from '../passport-manager';
import Models from '../models';
import {ObjectID} from 'mongodb';
import {successHandler, errorHandler, parseParameters, isLoggedIn, isLoggedOut} from './handlers';
import fs from 'fs';
import path from 'path';
import passportManager from '../passport-manager';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import expressSession from 'express-session';
import config from '../config';

const addRoutesForCrudOperations = (schemaName, app, filter) =>
{

    const Model = Models.getModel(schemaName);
    const path = pluralize(schemaName);

    app.get(`/${path}`, filter, (request, response) => co(function* ()
    {
        const {query, sort, limit, skip} = parseParameters(request.url);
        const models = yield Model.findMany({query, sort, limit, skip});
        successHandler(response, {items: models});
    }).catch(errorHandler(response)));

    app.get(`/${path}/:id`, filter, (request, response) => co(function* ()
    {
        const model = yield Model.findOne({_id: new ObjectID(request.params.id)});
        successHandler(response, model);
    }).catch(errorHandler(response)));

    app.post(`/${path}`, filter, (request, response) => co(function* ()
    {
        const model = new Model(request.body);
        yield model.save();
        successHandler(response, {_id: model.id});
    }).catch(errorHandler(response)));

    app.put(`/${path}/:id`, filter, (request, response) => co(function* ()
    {
        const model = yield Model.findOne({_id: new ObjectID(request.params.id)});
        if (model)
        {
            Object.assign(model.values, request.body);
            yield model.save();
        }
        successHandler(response, {});
    }).catch(errorHandler(response)));

    app.delete(`/${path}/:id`, filter, (request, response) => co(function* ()
    {
        yield Model.deleteOne({_id: new ObjectID(request.params.id)});
        successHandler(response, {});
    }).catch(errorHandler(response)));

    return app;
};

const addRoutesForAuth = (app, loginCheck, logoutCheck, authentication) =>
{

    app.post('/login', logoutCheck, authentication, (request, response) =>
    {
        successHandler(response, {});
    });

    app.get('/logout', loginCheck, (request, response) =>
    {
        request.logout();
        successHandler(response, {});
    });

    return app;
};

const addRoutesForHome = (app) =>
{

    app.get(`/`, (request, response) => co(function* ()
    {
        successHandler(response, {});
    }).catch(errorHandler(response)));

    return app;
};

const addRoutesForUser = (app, filter) =>
{

    const UserModel = Models.getModel('user');

    app.get(`/users/me`, filter, (request, response) => co(function* ()
    {
        if (request.user)
        {
            const model = yield UserModel.findOne({_id: new ObjectID(request.user._id)});
            successHandler(response, model);
        }
        else
        {
            successHandler(response, null);
        }
    }).catch(errorHandler(response)));

    app.put(`/users/:id/password`, filter, (request, response) => co(function* ()
    {
        const model = yield UserModel.findOne({_id: new ObjectID(request.params.id)});

        if (model)
        {
            Object.assign(model.values, request.body, {password_update: true});
            yield model.save();
        }

        successHandler(response, {});
    }).catch(errorHandler(response)));

    return app;
};

const addRoutesForSetting = (app, filter) =>
{

    const SettingModel = Models.getModel('setting');

    app.get(`/setting`, filter, (request, response) => co(function* ()
    {
        const model = yield SettingModel.getSetting();
        successHandler(response, model);
    }).catch(errorHandler(response)));

    app.put(`/setting`, filter, (request, response) => co(function* ()
    {
        yield SettingModel.setSetting(request.body);
        successHandler(response, {});
    }).catch(errorHandler(response)));

    return app;
};

const addRoutesForThemes = (app, filter) =>
{
    const themeDir = path.resolve(__dirname, '../public-app/static/bundle/themes');

    app.get(`/themes`, filter, (request, response) => co(function* ()
    {
        const fileNames = yield new Promise((res, rej) => fs.readdir(themeDir, (err, result) =>
        {
            if (err) return rej(err);
            res(result);
        }));

        const nameCounts = {};
        const regexBase = /^(.+)-base\.css$/;
        const regexPost = /^(.+)-post\.css$/;

        for (const fileName of fileNames)
        {
            if (regexBase.test(fileName))
            {
                const name = RegExp.$1;
                nameCounts[name] = Number.isInteger(nameCounts[name]) ? nameCounts[name] + 1 : 1;
            }
            else if (regexPost.test(fileName))
            {
                const name = RegExp.$1;
                nameCounts[name] = Number.isInteger(nameCounts[name]) ? nameCounts[name] + 1 : 1;
            }
        }

        const items = [];

        for (const name of Object.keys(nameCounts))
        {
            if (nameCounts[name] >= 2)
            {
                items.push({name});
            }
        }

        successHandler(response, {items});

    }).catch(errorHandler(response)));

    return app;
};

let adminApiApp = express();

adminApiApp.use(bodyParser.json());
adminApiApp.use(bodyParser.urlencoded({extended: false}));
adminApiApp.use(cookieParser());
adminApiApp.use(expressSession({
    secret: config.getValue('sessionSecret'),
    resave: true,
    saveUninitialized: true
}));

adminApiApp.use(passportManager.passport.initialize());
adminApiApp.use(passportManager.passport.session());

// The order of those functions matters.
adminApiApp = addRoutesForHome(adminApiApp);
adminApiApp = addRoutesForAuth(adminApiApp, isLoggedIn, isLoggedOut, PassportManager.localAuth);
adminApiApp = addRoutesForUser(adminApiApp, isLoggedIn);
adminApiApp = addRoutesForCrudOperations("user", adminApiApp, isLoggedIn);
adminApiApp = addRoutesForCrudOperations("category", adminApiApp, isLoggedIn);
adminApiApp = addRoutesForCrudOperations("post", adminApiApp, isLoggedIn);
adminApiApp = addRoutesForSetting(adminApiApp, isLoggedIn);
adminApiApp = addRoutesForThemes(adminApiApp, isLoggedIn);

export default adminApiApp;