"use strict";

var moment = require('moment');


module.exports = {
    'blog_content': function(text, options) {
        var ret = text.replace(/\n/g, '<br />');
        return ret;
    },

    'date_format': function(date, options) {
        return moment(date).format("MMM D, YYYY");
    }
};