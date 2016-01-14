import Store from './store';
import { Actions } from '../constants';
import WebApiUtils from '../utilities/web-api-utils';


class UserStore extends Store {

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
            [Actions.USERS_LOAD_REQUEST]: function ({action}) {
                if (Object.keys(this._items).length === 0) {
                    WebApiUtils.loadUsers();
                }
                this._latestAction = action;
            },

            [Actions.USERS_LOADED]: function ({action}) {
                for (let user of action.data) {
                    this._items[user._id] = user;
                }
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
                delete this._items[id];
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
        return Object.keys(this._items).map(key => this._items[key]);
    }

    /**
     * @public
     * @param id
     * @returns {T}
     */
    get(id) {
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