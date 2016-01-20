import Store from './store';
import { Actions } from '../constants';
import WebApiUtils from '../utilities/web-api-utils';
import UserStore from './user-store';
import CategoryStore from './category-store';
import BlogStore from './blog-store';
import Dispatcher from '../dispatcher'

class PostStore extends Store {

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

            [Actions.POSTS_LOADED]: function ({action}) {
                for (let post of action.data) {
                    this._items[post._id] = post;
                }
                this._initialized = true;
                this._latestAction = action;
            },

            [Actions.POST_CREATED]: function ({action}) {
                var post = action.data;
                this._items[post._id] = post;
                this._latestAction = action;
            },

            [Actions.POST_CREATE_FAILED]: function ({action}) {
                this._latestAction = action;
            },

            [Actions.POST_UPDATED]: function ({action}) {
                var post = action.data;
                this._items[post._id] = post;
                this._latestAction = action;
            },

            [Actions.POST_UPDATE_FAILED]: function ({action}) {
                this._latestAction = action;
            },

            [Actions.POST_DELETED]: function ({action}) {
                var id = action.data;

                if (this._items[id]) {
                    delete this._items[id];
                }

                this._latestAction = action;
            },

            [Actions.POST_DELETE_FAILED]: function ({action}) {
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
            WebApiUtils.loadPosts();
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
            WebApiUtils.loadPosts();
        }

        return this._items[id];
    }

    /**
     * @public
     * @returns {A}
     */
    get latestAction() {
        return this._latestAction;
    }
}


export default new PostStore();