"use strict";

class ExtendableError extends Error {
    constructor(message) {
        super(message);
        this.name = this.constructor.name;
        this.message = message;
        Error.captureStackTrace(this, this.constructor.name)
    }
}

class WeblogJsConfigError extends ExtendableError {
    constructor(m) {
        super(m);
    }
}

class WeblogJsAuthError extends ExtendableError {
    constructor(m) {
        super(m);
    }
}

class WeblogJs404Error extends ExtendableError {
    constructor(m) {
        super(m);
    }
}

module.exports = {
    WeblogJsConfigError,
    WeblogJsAuthError,
    WeblogJs404Error
};