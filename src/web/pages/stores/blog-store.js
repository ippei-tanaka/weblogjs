import Store from './store';
import { Actions } from '../constants';
import WebApiUtils from '../utilities/web-api-utils';


class BlogStore extends Store {

    constructor(...args) {
        super(...args);

        /**
         * @private
         */
        this._initialized = false;

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
            [Actions.BLOGS_LOADED]: function ({action}) {
                for (let blog of action.data) {
                    this._items[blog._id] = blog;
                }
                this._initialized = true;
                this._latestAction = action;
            },

            [Actions.BLOG_CREATED]: function ({action}) {
                var blog = action.data;
                this._items[blog._id] = blog;
                this._latestAction = action;
            },

            [Actions.BLOG_CREATE_FAILED]: function ({action}) {
                this._latestAction = action;
            },

            [Actions.BLOG_UPDATED]: function ({action}) {
                var blog = action.data;
                this._items[blog._id] = blog;
                this._latestAction = action;
            },

            [Actions.BLOG_UPDATE_FAILED]: function ({action}) {
                this._latestAction = action;
            },

            [Actions.BLOG_DELETED]: function ({action}) {
                var id = action.data;

                if (this._items[id]) {
                    delete this._items[id];
                }

                this._latestAction = action;
            },

            [Actions.BLOG_DELETE_FAILED]: function ({action}) {
                this._latestAction = action;
            }
        }
    }

    /**
     * @public
     * @returns {Array}
     */
    getAll() {
        if (!this._initialized) {
            WebApiUtils.loadBlogs();
        }

        return Object.keys(this._items).map(key => this._items[key]);
    }

    /**
     * @public
     * @param id
     * @returns {T}
     */
    get(id) {
        if (!this._initialized) {
            WebApiUtils.loadBlogs();
        }

        return this._items[id];
    }

    /**
     * @public
     * @returns {A}
     */
    get latestAction () {
        return this._latestAction;
    }
}


export default new BlogStore();