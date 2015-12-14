"use strict";


class BlogDataBuilder {
    constructor(args) {
        this._categoryName = args.categoryName;
        this._tagName = args.tagName;
        this._postTitle = args.postTitle;
        this._blogTitle = args.blogTitle;
        this._blogSlug = args.blogSlug;
        this._urlBuilder = args.urlBuilder;
    }

    build() {
        return {
            pageTitle: this.pageTitle,
            blogTitle: this._blogTitle,
            homeUri: this._urlBuilder(this._blogSlug)
        }
    }

    get pageTitle () {
        var str = this._blogTitle;

        if (this._tagName) {
            str = "#" + this._tagName + " - " + str;
        }

        if (this._categoryName) {
            str = this._categoryName + " category - " + str;
        }

        if (this._postTitle) {
            str = this._postTitle + " - " + str;
        }

        return str;
    }
}


module.exports = BlogDataBuilder;

