"use strict";

let callbacks = Object.freeze({
    'user-created': [],
    'user-updated': [],
    'user-deleted': []
});

export class Event {
    constructor() {}

    static fire (name, ...args) {
        if (!callbacks[name]) {
            throw new Error(`The event, "${name}", doesn't exist.`);
        }

        callbacks[name].forEach((callback) => {
            callback.apply({}, args);
        });
    }

    static on (name, callback) {

        if (!callbacks[name]) {
            throw new Error(`The event, "${name}", doesn't exist.`);
        }

        callbacks[name].push(callback);
    }
}

