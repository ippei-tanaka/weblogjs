import Store from './store';
import { Actions } from '../constants';
import WebApiUtils from '../utilities/web-api-utils';


class CategoryStore extends Store {

    constructor(...args) {
        super(...args);

        /**
         * @private
         */
        this._items = {};

        /**
         * @private
         */
        this._latestAction = null;
    }

    /**
     * @override
     */
    get _actionCallbackList() {
        return {
            [Actions.CATEGORIES_LOADED]: function ({action}) {
                for (let category of action.data) {
                    this._items[category._id] = category;
                }
                this._latestAction = action;
            },

            [Actions.CATEGORY_CREATED]: function ({action}) {
                var category = action.data;
                this._items[category._id] = category;
                this._latestAction = action;
            },

            [Actions.CATEGORY_CREATE_FAILED]: function ({action}) {
                this._latestAction = action;
            },

            [Actions.CATEGORY_UPDATED]: function ({action}) {
                var category = action.data;
                this._items[category._id] = category;
                this._latestAction = action;
            },

            [Actions.CATEGORY_UPDATE_FAILED]: function ({action}) {
                this._latestAction = action;
            },

            [Actions.CATEGORY_DELETED]: function ({action}) {
                var id = action.data;

                if (this._items[id]) {
                    delete this._items[id];
                }

                this._latestAction = action;
            },

            [Actions.CATEGORY_DELETE_FAILED]: function ({action}) {
                this._latestAction = action;
            }
        }
    }

    /**
     * @public
     * @returns {Array}
     */
    getAll() {

        if (Object.keys(this._items).length === 0) {
            WebApiUtils.loadCategories();
        }

        return Object.keys(this._items).map(key => this._items[key]);
    }

    /**
     * @public
     * @param id
     * @returns {T}
     */
    get(id) {
        var category = this._items[id];

        if (!category) {
            WebApiUtils.loadCategories();
        }

        return category;
    }

    /**
     * @public
     * @returns {A}
     */
    get latestAction () {
        return this._latestAction;
    }
}


export default new CategoryStore();