"use strict";

define(function () {

    var instance;

    var Route = function Route(uri, callback) {
        this.uri = uri;
        this.callback = callback;
    };

    Route.prototype = {
        /**
         * Check if the given uri is matched with the uri property of the route.
         * @param uri {RegExp|string}
         * @returns {*} - false if it doesn't match, array of parameters if matched.
         */
        match: function (uri) {


            // TODO : make tests for router
            var pattern = null;
            var patternString = "";
            var matched;

            if (typeof this.uri === "string") {
                // replace ":param" to regexp expression
                patternString = this.uri.replace(/:[a-zA-Z][a-zA-Z0-9]*/g,
                    function () {
                        return "([a-zA-Z0-9_\-]*)";
                    });
                pattern = new RegExp("^" + patternString + "\/?$");
            } else if (this.uri instanceof RegExp) {
                pattern = this.uri;
            } else {
                throw new Error("URI for the route should be string or RegExp.");
            }

            matched = uri.match(pattern);

            return matched && matched.length > 0 ? matched.slice(1) : false;
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
            var obj = this._findRoute(location.hash.slice(1));

            if (obj) {
                obj.route.callback.apply(null, obj.matched);
            }
        },

        _findRoute: function (uri) {
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