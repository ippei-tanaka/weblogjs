import co from 'co';
import {Router} from "express";
import React from "react";
import ReactDOMServer from 'react-dom/server';
import Layout from "./components/layout";
import Multiple from "./components/multiple";
import Single from "./components/single";
import NotFound from "./components/not-found";
import Models from '../models';
import {successHandler, errorHandler, parseParameters} from './handlers';
import {OK, NOT_FOUND} from '../constants/status-codes';

const parseParam = (str, defaultValue) =>
{
    const arr = str ? str.split('/') : [];
    return arr.length >= 3 && arr[2] ? arr[2] : defaultValue;
};

const findBlog = (blogSlug) => co(function* ()
{
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

const renderHtml = (element) =>
    ("<!DOCTYPE html>" + ReactDOMServer.renderToStaticMarkup(element));

const router = Router();


router.get(/^(\/blog\/[^/]+)?(\/category\/[^/]+)?(\/author\/[^/]+)?(\/tag\/[^/]+)?(\/|\/page\/[0-9]+\/?)?$/,
    (request, response) => co(function* ()
    {
        const UserModel = Models.getModel('user');
        const CategoryModel = Models.getModel('category');
        const PostModel = Models.getModel('post');

        const blogSlug = parseParam(request.params[0], null);
        const categorySlug = parseParam(request.params[1], null);
        const authorSlug = parseParam(request.params[2], null);
        const tag = parseParam(request.params[3], null);
        const page = parseParam(request.params[4], 1);

        const blogModel = yield findBlog(blogSlug);
        if (!blogModel)
        {
            response.type('html').status(NOT_FOUND).send(renderHtml(<NotFound />));
            return;
        }
        const blog = blogModel.values;

        let _query = {
            blog_id: blog._id,
            published_date: {$lt: new Date()},
            is_draft: {$ne: true}
        };

        if (tag)
        {
            _query.tags = {$in: [tag]};
        }

        const categoryModel = yield CategoryModel.findOne({slug: categorySlug});
        const category = categoryModel ? categoryModel.values : null;

        if (category)
        {
            _query.category_id = category._id;
        }

        const userModel = yield UserModel.findOne({slug: authorSlug});
        const user = userModel ? userModel.values : null;

        if (user)
        {
            _query.author_id = user._id;
        }

        const postModels = yield PostModel.findMany({
            query: _query,
            sort: {published_date: -1, created_date: 1},
            skip: blog.posts_per_page * (page - 1),
            limit: blog.posts_per_page
        });

        const sums = yield PostModel.aggregate([
            {
                $match: _query
            },
            {
                $group: {
                    _id: null,
                    size: {$sum: 1}
                }
            }
        ]);

        let totalPages = 0;

        if (sums.length > 0)
        {
            const sum = sums[0];
            totalPages = Math.ceil(sum.size / blog.posts_per_page);
        }

        const props = {
            blog,
            categories: {},
            posts: postModels.map(m => m.values),
            page,
            totalPages
        };

        response.type('html').status(OK).send(renderHtml(
            <Layout {...props} title="Multi" blogName={blog.name} theme={blog.theme}>
                <Multiple {...props} />
            </Layout>
        ));

    }).catch(errorHandler(response)));


router.get(/^(\/blog\/[^/]+)?\/post\/([^/]+)\/?$/, (request, response) => co(function* ()
{
    const blogSlug = parseParam(request.params[0], null);

    const postSlug = request.params[1];

    const PostModel = Models.getModel('post');

    const blogModel = yield findBlog(blogSlug);

    if (!blogModel)
    {
        response.type('html').status(NOT_FOUND).send(renderHtml(<NotFound />));
        return;
    }

    const blog = blogModel.values;

    const post = yield PostModel.findOne({
        blog_id: blog._id,
        slug: postSlug,
        published_date: {$lt: new Date()},
        is_draft: {$ne: true}
    });

    const props = {
        blog,
        categories: {},
        post: post.values
    };

    const htmlString = ReactDOMServer.renderToStaticMarkup(
        <Layout {...props} title="Single" blogName={blog.name} theme={blog.theme}>
            <Single {...props} />
        </Layout>
    );

    response.type('html').status(OK).send("<!DOCTYPE html>" + htmlString);

}).catch(errorHandler(response)));

export default router;
