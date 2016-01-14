import EventEmitter from "events";
import Dispatcher from "../dispatcher";


const CHANGE_EVENT = "change-event";


class ActionStorage {

    /**
     * @protected
     */
    constructor() {
        /**
         * @type EventEmitter
         * @private
         */
        this.__emitter = new EventEmitter();

        /**
         * @type Number
         * @private
         */
        this.__dispatcherToken = Dispatcher.register(this.__onActionInvoked.bind(this));
    }

    /**
     * @private
     */
    __onActionInvoked(payload) {
        var action = payload.action;
        var callback = this._actionCallbackList[action.actionType];
        var returnValue;

        if (typeof callback === 'function') {
            returnValue = callback.call(this, payload);
            this.__emitter.emit(CHANGE_EVENT);
        }

        return (typeof returnValue === 'undefined') ? true : returnValue;
    }

    //=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-

    /**
     * @protected
     */
    get _actionCallbackList() {
        throw new Error("Implement _actionCallbackList!");
    }

    //=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-

    /**
     * @public
     * @returns Number
     */
    get dispatcherToken() {
        return this.__dispatcherToken;
    }

    /**
     * @public
     * @param callback
     */
    addChangeListener(callback) {
        this.__emitter.on(CHANGE_EVENT, callback);
    }

    /**
     * @public
     * @param callback
     */
    removeChangeListener(callback) {
        this.__emitter.removeListener(CHANGE_EVENT, callback);
    }

}


export default ActionStorage;