import Store from './store';
import { Actions } from '../constants';
import WebApiUtils from '../utilities/web-api-utils';


class UserStore extends Store {

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
            [Actions.USERS_LOADED]: function ({action}) {
                for (let user of action.data) {
                    this._items[user._id] = user;
                }
                this._initialized = true;
                this._latestAction = action;
            },

            [Actions.USER_CREATED]: function ({action}) {
                var user = action.data;
                this._items[user._id] = user;
                this._latestAction = action;
            },

            [Actions.USER_CREATE_FAILED]: function ({action}) {
                this._latestAction = action;
            },

            [Actions.USER_UPDATED]: function ({action}) {
                var user = action.data;
                this._items[user._id] = user;
                this._latestAction = action;
            },

            [Actions.USER_UPDATE_FAILED]: function ({action}) {
                this._latestAction = action;
            },

            [Actions.USER_DELETED]: function ({action}) {
                var id = action.data;

                if (this._items[id]) {
                    delete this._items[id];
                }

                this._latestAction = action;
            },

            [Actions.USER_DELETE_FAILED]: function ({action}) {
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
            WebApiUtils.loadUsers();
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
            WebApiUtils.loadUsers();
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


export default new UserStore();