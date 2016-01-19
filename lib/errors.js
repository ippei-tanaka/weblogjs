class ExtendableError extends Error {
    constructor(message) {
        super(message);
        this.name = this.constructor.name;
        this.message = message;
        Error.captureStackTrace(this, this.constructor.name)
    }
}

class WeblogJsConfigError extends ExtendableError {
    constructor(message) {
        super(message);
    }
}

class WeblogJsAuthError extends ExtendableError {
    constructor(message) {
        super(message);
    }
}

class WeblogJs404Error extends ExtendableError {
    constructor(message) {
        super(message);
    }
}

module.exports = {
    WeblogJsConfigError,
    WeblogJsAuthError,
    WeblogJs404Error
};