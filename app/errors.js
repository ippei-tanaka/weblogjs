class WeblogJsError extends Error {
    constructor(message) {
        super(message);

        this.name = this.constructor.name;
        this.message = message;

        if (typeof Error.captureStackTrace === 'function') {
            Error.captureStackTrace(this, this.constructor);
        } else {
            this.stack = (new Error(message)).stack;
        }
    }

    toJSON() {
        return {
            name: this.name,
            message: this.message
        };
    }
}

export let DbError = class WeblogJsDatabaseError extends WeblogJsError {
    constructor(message) {
        super(message);
    }
};

export let UniqueIndexDbError = class WeblogJsUniqueIndexDatabaseError extends WeblogJsError {
    constructor({pathName, value}) {
        super(`WeblogJS Unique Index Error: the path "${pathName}", the value "${value}"`);
        this._pathName = pathName;
        this._value = value;
    }

    get pathName () {
        return this._pathName;
    }

    get value () {
        return this._value;
    }
};

export let ValidationError = class WeblogJsValidationError extends WeblogJsError {
    constructor(message) {
        super(message);
    }
};

export let SyntaxError = class WeblogJsSyntaxError extends WeblogJsError {
    constructor(message) {
        super(message);
    }
};