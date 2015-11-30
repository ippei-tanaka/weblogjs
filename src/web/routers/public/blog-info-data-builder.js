"use strict";


class BlogDataBuilder {
    constructor(args) {
        this._title = args.title;
        this._blogSlug = args.blogSlug;
        this._urlBuilder = args.urlBuilder;
    }

    build() {
        return {
            title: this._title,
            homeUri: this._urlBuilder(this._blogSlug)
        }
    }
}


module.exports = BlogDataBuilder;

