"use strict";

module.exports = {
    'blog_content': function(text, options) {
        var ret = text.replace(/\n/g, '<br />');
        return ret;
    }
};