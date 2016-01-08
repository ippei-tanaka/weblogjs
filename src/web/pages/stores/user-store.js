import EventEmitter from "events";
import AppDispatcher from "../dispatcher/app-dispatcher";
import ServerFacade from '../services/server-facade';
import { USER_CREATE, USER_UPDATE, USER_DELETE } from '../constants';

var users = [];

var emitter = new EventEmitter();

var dispatcherToken = AppDispatcher.register(payload => {
    var action = payload.action;

    switch (action.actionType) {
        case USER_CREATE:
            ServerFacade
                .createUser(action.data)
                .then(() => emitter.emit(CREATE_SUCCESS_EVENT, action))
                .catch(obj => emitter.emit(CREATE_FAIL_EVENT, action, obj.errors));
            break;

        case USER_UPDATE:
            ServerFacade
                .updateUser(action.id, action.data)
                .then(() => emitter.emit(UPDATE_SUCCESS_EVENT, action))
                .catch(obj => emitter.emit(UPDATE_FAIL_EVENT, action, obj.errors));
            break;

        case USER_DELETE:
            //destroy(action.id);
            //this.emit(DESTROY_EVENT);
            break;

        // add more cases for other actionTypes, like TODO_UPDATE, etc.
    }

    return true; // No errors. Needed by promise in Dispatcher.
});


export const CREATE_SUCCESS_EVENT = 'create-success';
export const CREATE_FAIL_EVENT = 'create-fail';
export const UPDATE_SUCCESS_EVENT = 'update-success';
export const UPDATE_FAIL_EVENT = 'user-update-fail';
export const DELETE_SUCCESS_EVENT = 'delete-success';
export const DELETE_FAIL_EVENT = 'delete-fail';


class UserStore {

    get dispatcherToken () {
        return dispatcherToken;
    }

    /**
     * Get the entire collection of users.
     * @public
     * @return {Promise}
     */
    getAll() {
        return ServerFacade.getUsers();
    }

    /**
     * Get the user by Id
     * @public
     * @param id
     * @returns {Promise}
     */
    getById(id) {
        return ServerFacade.getUser(id);
    }

    /**
     * @public
     * @param eventName
     * @param callback
     */
    addEventListener(eventName, callback) {
        emitter.on(eventName, callback);
    }

    /**
     * @public
     * @param eventName
     * @param callback
     */
    removeEventListener(eventName, callback) {
        emitter.removeListener(eventName, callback);
    }

}


export default new UserStore();