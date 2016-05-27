import co from 'co';
import url from 'url';
import { Router } from 'express';
import pluralize from 'pluralize';
import { SyntaxError } from '../errors';
import PassportManager from '../passport-manager';
import Models from '../models';

const bypass = (request, response, next) => next();

const isLoggedIn = (request, response, next) => {
    if (request.isAuthenticated())
        return next();

    response.sendStatus(401);
};

const isLoggedOut = (request, response, next) => {
    if (!request.isAuthenticated())
        return next();

    response.sendStatus(401);
};

const successHandler = (response, obj, code = 200) => {
    response.type('json').status(code).json(obj);
};

const errorHandler = (response, code = 400) => {
    return error => {
        if (error && error.stack) console.error(error.stack);
        response.type('json').status(code).json(error);
    }
};

const parseParameters = (_url) => {
    const obj = url.parse(_url, true);

    const params = Object.assign({
        query: "{}",
        sort: "{}",
        limit: "0",
        skip: "0"
    }, obj.query);

    let query, sort, limit, skip;

    try {
        query = JSON.parse(params.query);

        if (typeof query !== "object")
            throw null;

        for (let key of Object.keys(query)) {
            const val = query[key];
            if (typeof val !== "string"
                && typeof val !== "number") {
                throw null;
            }
        }
    } catch (error) {
        throw new SyntaxError("The query parameter is invalid.");
    }

    try {
        sort = JSON.parse(params.sort);

        if (typeof sort !== "object")
            throw null;

        for (let key of Object.keys(sort)) {
            const val = sort[key];
            if (val !== 1 && val !== -1) {
                throw null;
            }
        }
    } catch (error) {
        throw new SyntaxError("THe sort parameter is invalid.");
    }

    try {
        limit = Number.parseInt(params.limit);
        if (Number.isNaN(limit)) throw null;
    } catch (error) {
        throw new SyntaxError("The limit parameter is invalid.");
    }

    try {
        skip = Number.parseInt(params.skip);
        if (Number.isNaN(skip)) throw null;
    } catch (error) {
        throw new SyntaxError("The offset parameter is invalid.");
    }

    return {query, sort, limit, skip};
};

const addRoutesForCrudOperations = (schemaName, router, filter) => {

    const Model = Models.getModel(schemaName);
    const path = pluralize(schemaName);

    router.get(`/${path}`, filter, (request, response) => co(function* () {
        const { query, sort, limit, skip } = parseParameters(request.url);
        const models = yield Model.findMany({query, sort, limit, skip});
        successHandler(response, {items: models});
    }).catch(errorHandler(response)));

    router.get(`/${path}/:id`, filter, (request, response) => co(function* () {
        const model = yield Model.findOne({_id: request.params.id});
        successHandler(response, model);
    }).catch(errorHandler(response)));

    router.post(`/${path}`, filter, (request, response) => co(function* () {
        const model = new Model(request.body);
        const result = yield model.save();
        successHandler(response, {_id: result.insertedId});
    }).catch(errorHandler(response)));

    router.put(`/${path}/:id`, filter, (request, response) => co(function* () {
        const model = yield Model.findOne({_id: request.params.id});

        if (model) {
            model.setValues(request.body);
            yield model.save();
        }

        successHandler(response, {});
    }).catch(errorHandler(response)));

    router.delete(`/${path}/:id`, filter, (request, response) => co(function* () {
        yield Model.deleteOne({_id: request.params.id});
        successHandler(response, {});
    }).catch(errorHandler(response)));

    return router;
};

const addRoutesForAuth = (router, loginCheck, logoutCheck, authentication) => {

    router.post('/login', logoutCheck, authentication, (request, response) => {
        successHandler(response, {});
    });

    router.get('/logout', loginCheck, (request, response) => {
        request.logout();
        successHandler(response, {});
    });

    return router;
};

const addRoutesForHome = (router) => {

    router.get(`/`, (request, response) => co(function* () {
        successHandler(response, {});
    }).catch(errorHandler(response)));

    return router;
};

const addRoutesForUser = (router, filter) => {

    const UserModel = Models.getModel('user');

    router.get(`/users/me`, filter, (request, response) => co(function* () {
        if (request.user) {
            const model = yield UserModel.findOne({_id: request.user._id});
            successHandler(response, model);
        } else {
            successHandler(response, null);
        }
    }).catch(errorHandler(response)));

    router.put(`/users/:id/password`, filter, (request, response) => co(function* () {
        const model = yield UserModel.findOne({_id: request.params.id});

        if (model) {
            model.setValues(request.body);
            model.setValues({password_update: true});
            yield model.save();
        }

        successHandler(response, {});
    }).catch(errorHandler(response)));

    return router;
};

const addRoutesForSetting = (router, filter) => {

    const SettingModel = Models.getModel('setting');

    router.get(`/setting`, filter, (request, response) => co(function* () {
        const model = yield SettingModel.getSetting();
        successHandler(response, model);
    }).catch(errorHandler(response)));

    router.put(`/setting`, filter, (request, response) => co(function* () {
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

export default class RestfulApiRouter {

    constructor({basePath, authProtection}) {
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

    get basePath() {
        return this._basePath;
    }

    get router() {
        return this._router;
    }

}
