"use strict";

class Renderer {

    constructor(response) {
        this._response = response;
        this._viewName = "";
        this._viewData = {};
        this._status = 200;
    }

    set viewName(value) {
        this._viewName = value;
    }

    set viewData(value) {
        this._viewData = value;
    }

    set status(value) {
        this._status = value;
    }

    render() {
        this._response.status(this._status).render(`public/${this._viewName}`, this._viewData);
    }
}

module.exports = Renderer;

