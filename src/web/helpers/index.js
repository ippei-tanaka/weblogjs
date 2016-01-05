"use strict";

module.exports = {

    parseParams: function (query) {

        var ret = null;

        if (!query) {
            return ret;
        }

        ret = Object.assign({}, query);

        if (query.sort) {
            let sort = {};
            for (let value of query.sort.split(/\s*,\s*/)) {
                value = value.split(/\s+/);
                let path = value[0];
                let order = value[1];
                sort[path] = order === '-1' || order === '1' ? order : 1;
            }
            ret.sort = sort;
        }

        return ret;
    }

};

