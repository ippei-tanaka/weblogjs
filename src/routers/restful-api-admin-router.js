import co from 'co';
import url from 'url';
import { Router } from 'express';
import pluralize from 'pluralize';
import PassportManager from '../passport-manager';
import Models from '../models';
import { ObjectID } from 'mongodb';
import { successHandler, errorHandler, parseParameters, isLoggedIn, isLoggedOut, bypass } from './lib/handlers';

const addRoutesForCrudOperations = (schemaName, router, filter) =>
{

    const Model = Models.getModel(schemaName);
    const path = pluralize(schemaName);

    router.get(`/${path}`, filter, (request, response) => co(function* ()
    {
        const { query, sort, limit, skip } = parseParameters(request.url);
        const models = yield Model.findMany({query, sort, limit, skip});
        successHandler(response, {items: models});
    }).catch(errorHandler(response)));

    router.get(`/${path}/:id`, filter, (request, response) => co(function* ()
    {
        const model = yield Model.findOne({_id: new ObjectID(request.params.id)});
        successHandler(response, model);
    }).catch(errorHandler(response)));

    router.post(`/${path}`, filter, (request, response) => co(function* ()
    {
        const model = new Model(request.body);
        yield model.save();
        successHandler(response, {_id: model.id});
    }).catch(errorHandler(response)));

    router.put(`/${path}/:id`, filter, (request, response) => co(function* ()
    {
        const model = yield Model.findOne({_id: new ObjectID(request.params.id)});
        if (model)
        {
            Object.assign(model.values, request.body);
            yield model.save();
        }
        successHandler(response, {});
    }).catch(errorHandler(response)));

    router.delete(`/${path}/:id`, filter, (request, response) => co(function* ()
    {
        yield Model.deleteOne({_id: new ObjectID(request.params.id)});
        successHandler(response, {});
    }).catch(errorHandler(response)));

    return router;
};

const addRoutesForAuth = (router, loginCheck, logoutCheck, authentication) =>
{

    router.post('/login', logoutCheck, authentication, (request, response) =>
    {
        successHandler(response, {});
    });

    router.get('/logout', loginCheck, (request, response) =>
    {
        request.logout();
        successHandler(response, {});
    });

    return router;
};

const addRoutesForHome = (router) =>
{

    router.get(`/`, (request, response) => co(function* ()
    {
        successHandler(response, {});
    }).catch(errorHandler(response)));

    return router;
};

const addRoutesForUser = (router, filter) =>
{

    const UserModel = Models.getModel('user');

    router.get(`/users/me`, filter, (request, response) => co(function* ()
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

    router.put(`/users/:id/password`, filter, (request, response) => co(function* ()
    {
        const model = yield UserModel.findOne({_id: new ObjectID(request.params.id)});

        if (model)
        {
            Object.assign(model.values, request.body, {password_update: true});
            yield model.save();
        }

        successHandler(response, {});
    }).catch(errorHandler(response)));

    return router;
};

const addRoutesForSetting = (router, filter) =>
{

    const SettingModel = Models.getModel('setting');

    router.get(`/setting`, filter, (request, response) => co(function* ()
    {
        const model = yield SettingModel.getSetting();
        successHandler(response, model);
    }).catch(errorHandler(response)));

    router.put(`/setting`, filter, (request, response) => co(function* ()
    {
        yield SettingModel.setSetting(request.body);
        successHandler(response, {});
    }).catch(errorHandler(response)));

    return router;
};

/*

//-------------------------------------------------------
// Privileges

router.get('/privileges', isLoggedIn, response((ok) => {
    ok(privileges);
}));

*/

export default class AdminRestfulApiRouter {

    constructor ({basePath, authProtection = true})
    {
        this._basePath = basePath;

        let router = new Router();

        const loginCheck = authProtection ? isLoggedIn : bypass;
        const logoutCheck = authProtection ? isLoggedOut : bypass;
        const authentication = authProtection ? PassportManager.localAuth : bypass;

        // The order of those functions matters.
        router = addRoutesForHome(router);
        router = addRoutesForAuth(router, loginCheck, logoutCheck, authentication);
        router = addRoutesForUser(router, loginCheck);
        router = addRoutesForCrudOperations("user", router, loginCheck);
        router = addRoutesForCrudOperations("category", router, loginCheck);
        router = addRoutesForCrudOperations("blog", router, loginCheck);
        router = addRoutesForCrudOperations("post", router, loginCheck);
        router = addRoutesForSetting(router, loginCheck);

        this._router = router
    }

    get basePath ()
    {
        return this._basePath;
    }

    get router ()
    {
        return this._router;
    }

}
