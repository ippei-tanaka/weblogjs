"use strict";

define(function () {

    var instance;

    var Route = function Route(uri, callback) {
        this.uri = uri;
        this.callback = callback;
    };

    Route.prototype = {
        match: function (obj) {
            if (obj instanceof RegExp) {
                return obj.test(this.uri);
            } else if (typeof obj === "string") {
                return obj === this.uri;
            }
        }
    };

    var Router = function Router() {
        this.routes = [];
        this.defaultRoute = new Route(null, function () {
        });
    };

    Router.prototype = {

        /**
         * Add a route
         * @param uri {string|RegExp}
         * @param callback {function}
         */
        addRoute: function (uri, callback) {
            this.routes.push(new Route(uri, callback));
        },

        /**
         * Set the default route callback
         * @param callback {function}
         */
        setDefaultRouteCallback: function (callback) {
            this.defaultRoute.callback = callback;
        },

        /**
         * Start listening hash-change event
         * @param [listenFirstHash] {boolean}
         */
        listen: function (listenFirstHash) {
            window.addEventListener("hashchange", this._onHashChanged.bind(this), false);

            if (listenFirstHash) {
                this._onHashChanged();
            }
        },

        /**
         * Change the hash
         * @param hash {string}
         */
        changeHash: function (hash) {
            window.location.hash = hash;
        },

        _onHashChanged: function () {
            var route = this._findRoute(location.hash.slice(1));

            if (route) {
                route.callback.call(null);
            }
        },

        _findRoute: function (obj) {
            for (var i = 0; i < this.routes.length; i++) {
                if (this.routes[i].match(obj)) {
                    return this.routes[i];
                }
            }
            return this.defaultRoute;
        }
    };

    /**
     * Get the instance of Router
     * @returns {Router}
     */
    Router.getInstance = function () {
        if (!instance) {
            instance = new Router();
        }
        return instance;
    };

    return Router.getInstance();

});