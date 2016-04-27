import { ObjectID } from 'mongodb';
import validator from 'validator';
import co from 'co';
import url from 'url';
import { Router } from 'express';
import CollectionCrudOperator from '../db/collection-crud-operator';

//var router = require('express').Router();
//var url = require('url');
/*
var api = require('../api');
var userManager = api.userManager;
var postManager = api.postManager;
var blogManager = api.blogManager;
var settingManager = api.settingManager;
var privileges = api.privileges;
*/
var localAuth = require('../server/passport-manager').localAuth;

//-------------------------------------------------------
// Utility Functions


var parseParams = function (query) {

    var ret = null;

    if (!query) {
        return ret;
    }

    ret = Object.assign({}, query);

    if (query.sort) {
        let sort = {};
        for (let value of query.sort.split(/\s*,\s*/)) {
            value = value.split(/\s+/);
            let path = value[0];
            let order = value[1];
            sort[path] = order === '-1' || order === '1' ? order : 1;
        }
        ret.sort = sort;
    }

    return ret;
};


var response = (callback) => {
    return (request, response) => {
        var ok = (json) => {
            response.type('json').status(200).json(json);
        };
        var error = (json, code) => {
            // TODO: change HTTP code based on the type of the error
            response.type('json').status(code || 400).json(json);
        };
        callback(ok, error, request, response);
    }
};

var isLoggedIn = (request, response, next) => {
    return next();


    if (request.isAuthenticated())
        return next();

    response.sendStatus(401);
};


var isLoggedOut = (request, response, next) => {
    if (!request.isAuthenticated())
        return next();

    response.sendStatus(401);
};

/*
//-------------------------------------------------------
// Home

router.get('/', response((ok) => {
    ok({});
}));


//-------------------------------------------------------
// Login

router.post('/login', isLoggedOut, localAuth, response((ok) => {
    ok({});
}));


//-------------------------------------------------------
// Logout

router.get('/logout', isLoggedIn, response((ok, error, request) => {
    request.logout();
    ok({});
}));


//-------------------------------------------------------
// User

router.get('/users', isLoggedIn, response((ok, error, request) => {
    var urlParts = url.parse(request.url, true),
        query = urlParts.query;

    userManager.find({}, parseParams(query))
        .then((data) => ok({items: data}))
        .catch(error);
}));

router.get('/users/me', isLoggedIn, response((ok, error, request) => {
    userManager.findById(request.user._id)
        .then(ok)
        .catch(error);
}));

router.get('/users/:id', isLoggedIn, response((ok, error, request) => {
    userManager.findById(request.params.id)
        .then(ok)
        .catch(error);
}));

router.post('/users', isLoggedIn, response((ok, error, request) => {
    userManager.createRegularUser(request.body)
        .then(ok)
        .catch(error);
}));

router.put('/users/:id', isLoggedIn, response((ok, error, request) => {
    userManager.updateById(request.params.id, request.body)
        .then(ok)
        .catch(error);
}));

router.delete('/users/:id', isLoggedIn, response((ok, error, request) => {
    userManager.removeById(request.params.id)
        .then(ok)
        .catch(error);
}));


//-------------------------------------------------------
// Privileges

router.get('/privileges', isLoggedIn, response((ok) => {
    ok(privileges);
}));

*/

//-------------------------------------------------------
// Category


const successHandler = (response, obj, code = 200) => {
    response.type('json').status(code).json(obj);
};

const errorHandler = (response, code = 400) => {
    return error => {
        console.error(error);
        response.type('json').status(code).json(error);
    }
};

const buildRouter = (dbClient) => {

    const router = new Router();

    const categoryOperator = new CollectionCrudOperator({
        dbClient,
        collectionName: "categories"
    });

    router.get('/categories', isLoggedIn, (request, response) => co(function* () {
        const { query } = url.parse(request.url, true);
        const items = yield categoryOperator.findMany(query);
        successHandler(response, {items: items});
    }).catch(errorHandler(response)));

    router.get('/categories/:id', isLoggedIn, (request, response) => co(function* () {
        const item = yield categoryOperator.findOne(request.params.id);
        successHandler(response, item);
    }).catch(errorHandler(response)));

    router.post('/categories', isLoggedIn, (request, response) => co(function* () {
        const item = yield categoryOperator.insertOne(request.body);
        successHandler(response, {_id: item.insertedId});
    }).catch(errorHandler(response)));

    router.put('/categories/:id', isLoggedIn, (request, response) => co(function* () {
        yield categoryOperator.updateOne(request.params.id, request.body);
        successHandler(response, {});
    }).catch(errorHandler(response)));

    router.delete('/categories/:id', isLoggedIn, (request, response) => co(function* () {
        yield categoryOperator.deleteOne(request.params.id);
        successHandler(response, {});
    }).catch(errorHandler(response)));

    return router;
};

/*

//-------------------------------------------------------
// Post

router.get('/posts', isLoggedIn, response((ok, error, request) => {
    var urlParts = url.parse(request.url, true),
        query = urlParts.query;

    query = parseParams(query);

    postManager.find({}, query)
        .then((data) => ok({items: data}))
        .catch(error);
}));

router.get('/posts/:id', isLoggedIn, response((ok, error, request) => {
    postManager.findById(request.params.id)
        .then(ok)
        .catch(error);
}));

router.post('/posts', isLoggedIn, response((ok, error, request) => {
    postManager.create(request.body)
        .then(ok)
        .catch(error);
}));

router.put('/posts/:id', isLoggedIn, response((ok, error, request) => {
    postManager.updateById(request.params.id, request.body)
        .then(ok)
        .catch(error);
}));

router.delete('/posts/:id', isLoggedIn, response((ok, error, request) => {
    postManager.removeById(request.params.id)
        .then(ok)
        .catch(error);
}));


//-------------------------------------------------------
// Blogs

router.get('/blogs', isLoggedIn, response((ok, error, request) => {
    var urlParts = url.parse(request.url, true),
        query = urlParts.query;

    query = parseParams(query);

    blogManager.find({}, query)
        .then((data) => ok({items: data}))
        .catch(error);
}));

router.get('/blogs/:id', isLoggedIn, response((ok, error, request) => {
    blogManager.findById(request.params.id)
        .then(ok)
        .catch(error);
}));

router.post('/blogs', isLoggedIn, response((ok, error, request) => {
    blogManager.create(request.body)
        .then(ok)
        .catch(error);
}));

router.put('/blogs/:id', isLoggedIn, response((ok, error, request) => {
    blogManager.updateById(request.params.id, request.body)
        .then(ok)
        .catch(error);
}));

router.delete('/blogs/:id', isLoggedIn, response((ok, error, request) => {
    blogManager.removeById(request.params.id)
        .then(ok)
        .catch(error);
}));


//-------------------------------------------------------
// Setting


router.get('/setting', isLoggedIn, response((ok, error) => {
    settingManager.getSetting()
        .then(ok)
        .catch(error);
}));

router.put('/setting', isLoggedIn, response((ok, error, request) => {
    settingManager.setFront(request.body ? request.body.front : null)
        .then(ok)
        .catch((eee) => {
            console.error(eee);
            error(eee);
        });
}));
*/

export default class RestfulApiRouter {

    constructor({basePath, dbClient}) {
        this._basePath = basePath;
        this._router = buildRouter(dbClient);
    }

    get basePath() {
        return this._basePath;
    }

    get router() {
        return this._router;
    }

}
