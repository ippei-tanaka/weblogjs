define(function () {

    var callbacks = Object.freeze({
        'user-created': [],
        'user-updated': [],
        'user-deleted': []
    });

    function EventManager () {}

    EventManager.prototype =
    {
        fire: function (name, args) {
            if (!callbacks[name]) {
                throw new Error(`The event, "${name}", doesn't exist.`);
            }

            callbacks[name].forEach((callback) => {
                callback.apply({}, args);
            });
        },

        on: function (name, callback) {
            if (!callbacks[name]) {
                throw new Error(`The event, "${name}", doesn't exist.`);
            }

            callbacks[name].push(callback);
        }
    };

    return new EventManager();
});
