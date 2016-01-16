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
        this._setting = {};

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
            [Actions.SETTING_LOADED]: function ({action}) {
                this._setting = action.data;
                this._initialized = true;
                this._latestAction = action;
            },

            [Actions.SETTING_UPDATED]: function ({action}) {
                this._setting = action.data;
                this._latestAction = action;
            },

            [Actions.SETTING_UPDATE_FAILED]: function ({action}) {
                this._latestAction = action;
            }
        }
    }

    /**
     * @public
     * @param id
     * @returns {T}
     */
    get() {
        if (!this._initialized) {
            WebApiUtils.loadSetting();
        }

        return this._setting;
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