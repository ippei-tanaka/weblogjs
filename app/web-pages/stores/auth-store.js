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
        this._isLoggedIn = false;

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
            [Actions.LOG_IN_SUCCEEDED]: function () {
                this._initialized = true;
                //this._isLoggedIn = true;
            },

            [Actions.LOG_IN_FAILED]: function () {
                this._initialized = true;
                //this._isLoggedIn = false;
            },

            [Actions.AUTH_STATUS_CHECKED]: function ({action}) {
                this._initialized = true;
                this._isLoggedIn = !!action.data;
            }
        }
    }

    get isLoggedIn() {
        if (!this._initialized) {
            WebApiUtils.checkAuthStatus();
        }
        return this._isLoggedIn;
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