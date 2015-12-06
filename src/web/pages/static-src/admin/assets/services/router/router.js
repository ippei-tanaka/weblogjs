import Route from "./route";

var instance;

class Router {

    constructor() {
        this.routes = [];
        this.defaultRoute = new Route(null, function () {
        });
    }

    /**
     * Add a route
     * @param uri {string|RegExp}
     * @param callback {function}
     */
    addRoute(uri, callback) {
        this.routes.push(new Route(uri, callback));
    }

    /**
     * Set the default route callback
     * @param callback {function}
     */
    setDefaultRouteCallback(callback) {
        this.defaultRoute.callback = callback;
    }

    /**
     * Start listening hash-change event
     * @param [listenFirstHash] {boolean}
     */
    listen(listenFirstHash) {
        window.addEventListener("hashchange", this._onHashChanged.bind(this), false);

        if (listenFirstHash) {
            this._onHashChanged();
        }
    }

    /**
     * Change the hash
     * @param hash {string}
     */
    changeHash(hash) {
        window.location.hash = hash;
    }

    _onHashChanged() {
        var obj = this._findRoute(location.hash.slice(1));

        if (obj) {
            obj.route.callback.apply(null, obj.matched);
        }
    }

    _findRoute(uri) {
        for (var i = 0; i < this.routes.length; i++) {

            var matched = this.routes[i].match(uri);

            if (matched) {
                return {
                    route: this.routes[i],
                    matched: matched
                };
            }
        }
        return {
            route: this.defaultRoute,
            matched: []
        };
    }

    /**
     * Get the instance of Router
     * @returns {Router}
     */
    static getInstance () {
        if (!instance) {
            instance = new Router();
        }
        return instance;
    }
}

export default Router;