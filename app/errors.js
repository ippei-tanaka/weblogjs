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

export let ValidationError = class WeblogJsValidationError {
    constructor(messages) {
        this.messages = messages;
    }

    toJSON() {
        return {
            name: this.name,
            messages: this.messages
        };
    }
};