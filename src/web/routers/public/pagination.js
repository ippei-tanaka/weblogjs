"use strict";

var Type = require('../../../utility').Type;

class Pagination {
    constructor(args) {
        this.currentPage = Type.toInt(args.currentPage);
        this.totalPages = Math.ceil(Type.toInt(args.totalItems) / Type.toInt(args.itemsPerPage));
        this.urlBuilder = args.urlBuilder;
    }

    get nextPage () {
        return this.currentPage + 1 <= this.totalPages ? this.currentPage + 1 : null;
    }

    get prevPage () {
        return 0 <= this.currentPage - 1 ? this.currentPage - 1 : null;
    }

    get nextPageUrl () {
        return this.nextPage ? this.urlBuilder(this.nextPage) : null;
    }

    get prevPageUrl () {
        return this.prevPage ? this.urlBuilder(this.prevPage) : null;
    }

    get needPagination () {
        return this.totalPages > 1;
    }

    get isCurrentPageInvalid () {
        return 0 < this.currentPage && this.currentPage <= this.totalPages;
    }
}

module.exports = Pagination;

