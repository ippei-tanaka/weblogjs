import co from 'co';
import url from 'url';
import { Router } from 'express';
import CollectionCrudOperator from '../db/collection-crud-operator';
import pluralize from 'pluralize';
import { SyntaxError } from '../errors';
import PassportManager from '../passport-manager';
import Schemas from '../schemas';

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

router.get('/users/me', isLoggedIn, response((ok, error, request) => {
    userManager.findById(request.user._id)
        .then(ok)
        .catch(error);
}));

//-------------------------------------------------------
// Privileges

router.get('/privileges', isLoggedIn, response((ok) => {
    ok(privileges);
}));

*/

const isLoggedIn = (request, response, next) => {
    //return next();
    if (request.isAuthenticated())
        return next();

    response.sendStatus(401);
};

const isLoggedOut = (request, response, next) => {
    return next();

    if (!request.isAuthenticated())
        return next();

    response.sendStatus(401);
};

const successHandler = (response, obj, code = 200) => {
    response.type('json').status(code).json(obj);
};

const errorHandler = (response, code = 400) => {
    return error => {
        //console.log(error);
        //if (error && error.stack) console.error(error.stack);
        response.type('json').status(code).json(error);
    }
};

const addRoutesForAuth = (router) => {

    router.post('/login', isLoggedOut, PassportManager.localAuth, (request, response) => {
        successHandler(response, {});
    });

    return router;
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

const addRoutesForCrudOperations = (schemaName, router) => {

    const collectionName = pluralize(schemaName);

    const operator = new CollectionCrudOperator({collectionName});

    const schema = Schemas.getSchema(schemaName);

    router.get(`/${collectionName}`, isLoggedIn, (request, response) => co(function* () {
        const { query, sort, limit, skip } = parseParameters(request.url);
        const docs = yield operator.findMany(schema.convertToType(query), sort, limit, skip, schema.projection);
        successHandler(response, {items: docs});
    }).catch(errorHandler(response)));

    router.get(`/${collectionName}/:id`, isLoggedIn, (request, response) => co(function* () {
        const doc = yield operator.findOne(schema.convertToType({_id: request.params.id}), schema.projection);
        successHandler(response, doc);
    }).catch(errorHandler(response)));

    router.post(`/${collectionName}`, isLoggedIn, (request, response) => co(function* () {
        const doc = yield operator.insertOne(yield schema.createDoc(request.body));
        successHandler(response, {_id: doc.insertedId});
    }).catch(errorHandler(response)));

    router.put(`/${collectionName}/:id`, isLoggedIn, (request, response) => co(function* () {
        const query = schema.convertToType({_id: request.params.id});
        const oldDoc = yield operator.findOne(query);
        const doc = yield schema.updateDoc(oldDoc, request.body);
        yield operator.updateOne(query, doc);
        successHandler(response, {});
    }).catch(errorHandler(response)));

    router.delete(`/${collectionName}/:id`, isLoggedIn, (request, response) => co(function* () {
        yield operator.deleteOne(schema.convertToType({_id: request.params.id}));
        successHandler(response, {});
    }).catch(errorHandler(response)));

    return router;
};

/*
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

    constructor({basePath}) {
        this._basePath = basePath;

        let router = new Router();

        router = addRoutesForCrudOperations("user", router);
        router = addRoutesForCrudOperations("category", router);
        router = addRoutesForCrudOperations("blog", router);
        router = addRoutesForCrudOperations("post", router);
        router = addRoutesForAuth(router);

        this._router = router
    }

    get basePath() {
        return this._basePath;
    }

    get router() {
        return this._router;
    }

}
