class Event {
    constructor(x, y, color) {
        this._callbacks = [];
    }

    fire() {
        var args = Array.prototype.slice.call(arguments);

        this._callbacks.forEach(function (callback) {
            callback.apply({}, args);
        }.bind(this));
    }

    on(callback) {
        this._callbacks.push(callback);
    }

    off(callback) {
        var indexes = [];

        this._callbacks.forEach(function (_callback, _index) {
            if (callback === _callback) {
                indexes.push(_index);
            }
        }.bind(this));

        indexes.forEach(function (index) {
            delete this._callbacks[index];
        }.bind(this));
    }
}

export default Event;