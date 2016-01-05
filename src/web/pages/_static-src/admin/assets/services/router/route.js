class Route {

    constructor(uri, callback) {
        this.uri = uri;
        this.callback = callback;
    }

    /**
     * Check if the given uri is matched with the uri property of the route.
     * @param uri {RegExp|string}
     * @returns {*} - false if it doesn't match, array of parameters if matched.
     */
    match(uri) {
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
}

export default Route;