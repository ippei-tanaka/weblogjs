"use strict";


var Setting = require('./models/setting');
var modelManager = require('./model-manager');
var settingManager = modelManager.applyTo(Setting);
var co = require('co');


module.exports = {

    getSetting: function () {
        return settingManager
            .find()
            .then((docs) => {
                var setting = docs.length >= 1 ? docs[0] : new Setting();
                return JSON.parse(JSON.stringify(setting));
            });
    },

    setFront: (blogId) => co(function* () {
        var setting = yield this.getSetting();

        setting.front = blogId;

        yield setting.save();

        return yield this.getSetting();
    }.bind(module.exports))
};