import Store from './store';
import { Actions } from '../constants';
import WebApiUtils from '../utilities/web-api-utils';


class AuthStore extends Store {

    constructor(...args) {
        super(...args);

        /**
         * @private
         */
        this._initialized = null;

        /**
         * @private
         */
        this._loginUser = null;

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
            [Actions.LOG_IN_SUCCEEDED]: function ({action}) {
                WebApiUtils.checkAuthStatus();
            },

            [Actions.LOG_IN_FAILED]: function () {
                WebApiUtils.checkAuthStatus();
            },

            [Actions.LOG_OUT_SUCCEEDED]: function () {
                WebApiUtils.checkAuthStatus();
            },

            [Actions.LOG_OUT_FAILED]: function () {
                WebApiUtils.checkAuthStatus();
            },

            [Actions.AUTH_STATUS_CHECKED]: function ({action}) {
                this._initialized = true;
                this._loginUser = action.data;
            }
        }
    }

    /**
     * @public
     * @returns {boolean}
     */
    get isLoggedIn() {
        if (!this._initialized) {
            WebApiUtils.checkAuthStatus();
        }

        return !!this._loginUser;
    }

    /**
     * @public
     * @returns {Object}
     */
    get loginUser () {
        if (!this._initialized) {
            WebApiUtils.checkAuthStatus();
        }

        return this._loginUser;
    }

    /**
     * @public
     * @returns {A}
     */
    get latestAction() {
        return this._latestAction;
    }
}


export default new AuthStore();