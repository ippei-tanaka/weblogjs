"use strict";


var router = require('express').Router();
var url = require('url');
var api = require('../api');
var userManager = api.userManager;
var categoryManager = api.categoryManager;
var postManager = api.postManager;
var blogManager = api.blogManager;
var settingManager = api.settingManager;
var privileges = api.privileges;
var localAuth = require('../server/passport-manager').localAuth;
var config = require('../config-manager').load();
var co = require('co');



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
    if (request.isAuthenticated())
        return next();

    response.sendStatus(401);
};


var isLoggedOut = (request, response, next) => {
    if (!request.isAuthenticated())
        return next();

    response.sendStatus(401);
};


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
        .then((data) => ok({ items: data }))
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


//-------------------------------------------------------
// Category

router.get('/categories', isLoggedIn, response((ok, error, request) => {
    var urlParts = url.parse(request.url, true),
        query = urlParts.query;

    categoryManager.find({}, parseParams(query))
        .then((data) => ok({ items: data }))
        .catch(error);
}));

router.get('/categories/:id', isLoggedIn, response((ok, error, request) => {
    categoryManager.findById(request.params.id)
        .then(ok)
        .catch(error);
}));

router.post('/categories', isLoggedIn, response((ok, error, request) => {
    categoryManager.create(request.body)
        .then(ok)
        .catch(error);
}));

router.put('/categories/:id', isLoggedIn, response((ok, error, request) => {
    categoryManager.updateById(request.params.id, request.body)
        .then(ok)
        .catch(error);
}));

router.delete('/categories/:id', isLoggedIn, response((ok, error, request) => {
    categoryManager.removeById(request.params.id)
        .then(ok)
        .catch(error);
}));


//-------------------------------------------------------
// Post

router.get('/posts', isLoggedIn, response((ok, error, request) => {
    var urlParts = url.parse(request.url, true),
        query = urlParts.query;

    query = parseParams(query);

    postManager.find({}, query)
        .then((data) => ok({ items: data }))
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
        .then((data) => ok({ items: data }))
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




export default class RestfulApiRouter {

    constructor(basePath) {
        this._basePath = basePath;
        this._router = router;
    }

    get basePath() {
        return this._basePath;
    }

    get router() {
        return this._router;
    }

}
