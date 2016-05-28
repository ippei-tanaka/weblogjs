import co from 'co';
import { Router } from 'express';
import pluralize from 'pluralize';
import PassportManager from '../passport-manager';
import Models from '../models';
import { successHandler, errorHandler, parseParameters } from './lib/handlers';

const addRoutesForCrudOperations = (schemaName, router) => {

    const Model = Models.getModel(schemaName);
    const path = pluralize(schemaName);

    router.get(`/${path}`, (request, response) => co(function* () {
        const { query, sort, limit, skip } = parseParameters(request.url);
        const models = yield Model.findMany({query, sort, limit, skip});
        successHandler(response, {items: models});
    }).catch(errorHandler(response)));

    router.get(`/${path}/:id`, (request, response) => co(function* () {
        const model = yield Model.findOne({_id: request.params.id});
        successHandler(response, model);
    }).catch(errorHandler(response)));

    return router;
};

const addRoutesForHome = (router) => {

    router.get(`/`, (request, response) => co(function* () {
        successHandler(response, {});
    }).catch(errorHandler(response)));

    return router;
};

const addRoutesForUser = (router) => {

    const UserModel = Models.getModel('user');

    router.get(`/users/me`, (request, response) => co(function* () {
        if (request.user) {
            const model = yield UserModel.findOne({_id: request.user._id});
            successHandler(response, model);
        } else {
            successHandler(response, null);
        }
    }).catch(errorHandler(response)));

    return router;
};

const addRoutesForSetting = (router) => {

    const SettingModel = Models.getModel('setting');

    router.get(`/setting`, (request, response) => co(function* () {
        const model = yield SettingModel.getSetting();
        successHandler(response, model);
    }).catch(errorHandler(response)));

    return router;
};

export default class PublicRestfulApiRouter {

    constructor({basePath}) {
        this._basePath = basePath;

        let router = new Router();

        router = addRoutesForHome(router);
        router = addRoutesForUser(router);
        router = addRoutesForCrudOperations("user", router);
        router = addRoutesForCrudOperations("category", router);
        router = addRoutesForCrudOperations("blog", router);
        router = addRoutesForCrudOperations("post", router);
        router = addRoutesForSetting(router);

        this._router = router
    }

    get basePath() {
        return this._basePath;
    }

    get router() {
        return this._router;
    }

}
