import co from 'co';
import {Router} from "express";
import React from "react";
import ReactDOMServer from 'react-dom/server';
import Layout from "./components/layout";
import Multiple from "./components/multiple";
import Single from "./components/single";
import Message from "./components/message";
import Models from '../models';
import {OK, NOT_FOUND, ERROR} from '../constants/status-codes';
import UserModel from '../models/user-model';
import CategoryModel from '../models/category-model';
import PostModel from '../models/post-model';
import SettingModel from '../models/setting-model';

const parseParam = (str, defaultValue) =>
{
    const arr = str ? str.split('/') : [];
    return arr.length >= 3 && arr[2] ? arr[2] : defaultValue;
};

const renderHtml = (element) =>
    ("<!DOCTYPE html>" + ReactDOMServer.renderToStaticMarkup(element));

const isProduction = process.env.NODE_ENV === "production";

const errorHandler = (response) => co.wrap(function* (e)
{

    const setting = (yield SettingModel.getSetting()).values;

    response.type('html').status(ERROR).send(renderHtml(
        <Layout title="Error" blogName={setting.name} theme={setting.theme}>
            <Message message={isProduction ? "Error Occurred." : e.message} />
        </Layout>
    ));
});

const router = Router();

router.get(/^(\/category\/[^/]+)?(\/author\/[^/]+)?(\/tag\/[^/]+)?(\/|\/page\/[0-9]+\/?)?$/, (request,
                                                                                              response) => co(function* ()
{
    const categorySlug = parseParam(request.params[0], null);
    const authorSlug = parseParam(request.params[1], null);
    const tag = parseParam(request.params[2], null);
    const page = parseParam(request.params[3], 1);

    let _query = {
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

    const setting = (yield SettingModel.getSetting()).values;

    const postModels = yield PostModel.findMany({
        query: _query,
        sort: {published_date: -1, created_date: 1},
        skip: setting.posts_per_page * (page - 1),
        limit: setting.posts_per_page
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
        totalPages = Math.ceil(sum.size / setting.posts_per_page);
    }

    const categoryName = category ? category.name + " - " : "";
    const tagName = tag ? tag + " - " : "";
    const authorName = user ? user.display_name + " - " : "";

    const categories = yield CategoryModel.findMany();

    const props = {
        categories: {},//categories.map(m => m.values),
        posts: postModels.map(m => m.values),
        page,
        totalPages,
        title: `${authorName}${categoryName}${tagName}${setting.name}`
    };

    response.type('html').status(OK).send(renderHtml(
        <Layout {...props} blogName={setting.name} theme={setting.theme}>
            <Multiple {...props} />
        </Layout>
    ));

}).catch(errorHandler(response)));

router.get(/^\/post\/([^/]+)\/?$/, (request, response, next) => co(function* ()
{
    const postSlug = request.params[0];

    const PostModel = Models.getModel('post');

    const post = yield PostModel.findOne({
        slug: postSlug,
        published_date: {$lt: new Date()},
        is_draft: {$ne: true}
    });

    if (!post)
    {
        return next();
    }

    const setting = (yield SettingModel.getSetting()).values;

    const values = post.values;

    const props = {
        categories: {},
        post: values,
        title: `${values.title} - ${setting.name}`
    };

    response.type('html').status(OK).send(renderHtml(
        <Layout {...props} blogName={setting.name} theme={setting.theme}>
            <Single {...props} />
        </Layout>
    ));

}).catch(errorHandler(response)));

router.get("*", (request, response) => co(function* ()
{
    const setting = (yield SettingModel.getSetting()).values;

    response.type('html').status(NOT_FOUND).send(renderHtml(
        <Layout title="Not Found" blogName={setting.name} theme={setting.theme}>
            <Message message="The page you are looking for is not found."/>
        </Layout>
    ));
}).catch(errorHandler(response)));

export default router;
