import co from 'co';
import { Router } from 'express';
import pluralize from 'pluralize';
import PassportManager from '../passport-manager';
import Models from '../models';
import { successHandler, errorHandler, parseParameters } from './lib/handlers';

/*
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

const addRoutesForSetting = (router) => {

    const SettingModel = Models.getModel('setting');

    router.get(`/setting`, (request, response) => co(function* () {
        const model = yield SettingModel.getSetting();
        successHandler(response, model);
    }).catch(errorHandler(response)));

    return router;
};
*/


const parseParam = (str, defaultValue) => {
    const arr = str ? str.split('/') : [];
    return arr.length >= 3 && arr[2] ? arr[2] : defaultValue;
};

const addRoutes = (router) => {

    const SettingModel = Models.getModel('setting');
    const UserModel = Models.getModel('user');
    const CategoryModel = Models.getModel('category');
    const PostModel = Models.getModel('post');
    const BlogModel = Models.getModel('blog');

    router.get(`/blogs`, (request, response) => co(function* () {
        const blogModels = yield BlogModel.findMany({});
        successHandler(response, {items: blogModels});
    }).catch(errorHandler(response)));

    router.get(/^(\/blog\/[^/]+)?(\/category\/[^/]+)?(\/author\/[^/]+)?(\/tag\/[^/]+)?\/posts(\/page\/[0-9]+\/?)?$/, (request, response) => co(function* () {
        const blogSlug = parseParam(request.params[0], null);
        const page = parseParam(request.params[4], 1);

        let blogModel = yield BlogModel.findOne({slug: blogSlug});

        if (!blogModel) {
            const settingModel = yield SettingModel.getSetting();
            blogModel = yield BlogModel.findOne({_id: settingModel.values.front_blog_id});
        }

        if (!blogModel) {
            throw new Error("Invalid request.");
        }

        const blogValues = blogModel.values;

        // TODO Use db query, skip and limit instead of using model method.
        const postModels = yield PostModel.findMany({query: {blog_id: blogValues._id}});
        const publishedPostModels = postModels.filter(post => post.published);
        const start = blogValues.posts_per_page * (page - 1);

        const selectedPostModels = publishedPostModels.slice(start, start + blogValues.posts_per_page);
        successHandler(response, {items: selectedPostModels});
    }).catch(errorHandler(response)));

    return router;
};

export default class PublicRestfulApiRouter {

    constructor({basePath}) {
        this._basePath = basePath;

        let router = new Router();

        /*
        router = addRoutesForCrudOperations("user", router);
        router = addRoutesForCrudOperations("category", router);
        router = addRoutesForCrudOperations("blog", router);
        router = addRoutesForCrudOperations("post", router);
        router = addRoutesForSetting(router);
        */

        router = addRoutes(router);

        this._router = router
    }

    get basePath() {
        return this._basePath;
    }

    get router() {
        return this._router;
    }

}
