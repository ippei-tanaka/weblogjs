"use strict";

class ExtendableError extends Error {
    constructor(message) {
        super(message);
        this.name = this.constructor.name;
        this.message = message;
        Error.captureStackTrace(this, this.constructor.name)
    }
}

class WeblogJsError extends ExtendableError {
    constructor(m) {
        super(m);
    }
}

module.exports = WeblogJsError;