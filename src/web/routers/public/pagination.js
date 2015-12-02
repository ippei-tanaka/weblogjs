"use strict";

var Type = require('../../../utility').Type;

class Pagination {
    constructor(args) {
        this._currentPage = Type.toInt(args.currentPage);
        this._totalPages = Math.ceil(Type.toInt(args.totalItems) / Type.toInt(args.itemsPerPage)) || 1;
        this._urlBuilder = args.urlBuilder;
    }

    get nextPage () {
        return this._currentPage + 1 <= this._totalPages ? this._currentPage + 1 : null;
    }

    get prevPage () {
        return 0 <= this._currentPage - 1 ? this._currentPage - 1 : null;
    }

    get nextPageUrl () {
        return this.nextPage ? this._urlBuilder(this.nextPage) : null;
    }

    get prevPageUrl () {
        return this.prevPage ? this._urlBuilder(this.prevPage) : null;
    }

    get needPagination () {
        return this._totalPages > 1;
    }

    get isCurrentPageValid () {
        return 0 < this._currentPage && this._currentPage <= this._totalPages;
    }
}

module.exports = Pagination;

