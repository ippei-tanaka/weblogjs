import co from 'co';
import { Router } from 'express';
import pluralize from 'pluralize';
import PassportManager from '../passport-manager';
import Models from '../models';
import { successHandler, errorHandler, parseParameters } from './lib/handlers';

const parseParam = (str, defaultValue) => {
    const arr = str ? str.split('/') : [];
    return arr.length >= 3 && arr[2] ? arr[2] : defaultValue;
};

const findBlog = (blogSlug) => co(function* () {

    const BlogModel = Models.getModel('blog');
    const SettingModel = Models.getModel('setting');

    let blogModel = yield BlogModel.findOne({slug: blogSlug});

    if (blogModel) return blogModel;

    const settingModel = yield SettingModel.getSetting();

    if (!settingModel) return null;

    const setting = settingModel.values;

    if (!setting || !setting.front_blog_id) return null;

    return yield BlogModel.findOne({_id: setting.front_blog_id});

});

const addRoutes = (router) => {

    const UserModel = Models.getModel('user');
    const CategoryModel = Models.getModel('category');
    const PostModel = Models.getModel('post');
    const BlogModel = Models.getModel('blog');
    const SettingModel = Models.getModel('setting');

    router.get(`/blogs`, (request, response) => co(function* () {
        const blogModels = yield BlogModel.findMany();
        successHandler(response, {items: blogModels});
    }).catch(errorHandler(response)));

    router.get(`/setting`, (request, response) => co(function* () {
        const settingModel = yield SettingModel.getSetting();
        successHandler(response, settingModel);
    }).catch(errorHandler(response)));

    router.get(`/front-blog`, (request, response) => co(function* () {
        const settingModel = yield SettingModel.getSetting();

        if (!settingModel) {
            successHandler(response, {});
            return;
        }

        const setting = settingModel.values;

        if (!setting || !setting.front_blog_id) {
            successHandler(response, {});
            return;
        }

        const blog = yield BlogModel.findOne({_id: setting.front_blog_id});
        successHandler(response, blog);

    }).catch(errorHandler(response)));

    router.get(/^(\/blog\/[^/]+)?(\/category\/[^/]+)?(\/author\/[^/]+)?(\/tag\/[^/]+)?\/posts(\/|\/page\/[0-9]+\/?)?$/, (request, response) => co(function* () {
        const blogSlug = parseParam(request.params[0], null);
        const categorySlug = parseParam(request.params[1], null);
        const authorSlug = parseParam(request.params[2], null);
        const tag = parseParam(request.params[3], null);
        const page = parseParam(request.params[4], 1);

        const blogModel = yield findBlog(blogSlug);
        if (!blogModel) {
            successHandler(response, {items: []});
            return;
        }
        const blog = blogModel.values;

        let _query = {
            blog_id: blog._id,
            published_date: {$lt: new Date()},
            is_draft: {$ne: true}
        };

        if (tag) {
            _query.tags = {$in: [tag]};
        }

        const categoryModel = yield CategoryModel.findOne({slug: categorySlug});
        const category = categoryModel ? categoryModel.values : null;

        if (category) {
            _query.category_id = category._id;
        }

        const userModel = yield UserModel.findOne({slug: authorSlug});
        const user = userModel ? userModel.values : null;

        if (user) {
            _query.author_id = user._id;
        }

        const postModels = yield PostModel.findMany({
            query: _query,
            sort: {published_date: -1, created_date: 1},
            skip: blog.posts_per_page * (page - 1),
            limit: blog.posts_per_page
        });

        successHandler(response, {items: postModels});

    }).catch(errorHandler(response)));

    router.get(/^(\/blog\/[^/]+)?\/categories\/?$/, (request, response) => co(function* () {

        const blogSlug = parseParam(request.params[0], null);

        const blogModel = yield findBlog(blogSlug);

        if (!blogModel) {
            successHandler(response, {items: []});
            return;
        }

        const blog = blogModel.values;

        const categorySums = yield PostModel.aggregate([
            {
                $match: {
                    blog_id: blog._id,
                    published_date: {$lt: new Date()},
                    is_draft: {$ne: true}
                }
            },
            {
                $group: {
                    _id: "$category_id",
                    size: {$sum: 1}
                }
            }
        ]);

        const categoryModels = yield CategoryModel.findMany({
            query: {_id: {$in: categorySums.map(obj => obj._id)}}
        });

        const categories = categoryModels.map((model) => {
            const values = model.values;
            const sumObj = categorySums.find(obj => obj._id.equals(values._id));
            return Object.assign({}, values, {size: sumObj.size});
        });

        successHandler(response, {items: categories});

    }).catch(errorHandler(response)));

    return router;
};

export default class PublicRestfulApiRouter {

    constructor({basePath}) {
        this._basePath = basePath;

        let router = new Router();
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
