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
            ServerFacade
                .deleteUser(action.id)
                .then(() => emitter.emit(DELETE_SUCCESS_EVENT, action))
                .catch(obj => emitter.emit(DELETE_FAIL_EVENT, action, obj.errors));
            break;
    }

    return true; // No errors. Needed by promise in Dispatcher.
});


const CREATE_SUCCESS_EVENT = 'create-success';
const CREATE_FAIL_EVENT = 'create-fail';
const UPDATE_SUCCESS_EVENT = 'update-success';
const UPDATE_FAIL_EVENT = 'user-update-fail';
const DELETE_SUCCESS_EVENT = 'delete-success';
const DELETE_FAIL_EVENT = 'delete-fail';


class UserStore {

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

    addCreateSuccessEventListener(callback) {
        emitter.on(CREATE_SUCCESS_EVENT, callback);
    }

    removeCreateSuccessEventListener(callback) {
        emitter.removeListener(CREATE_SUCCESS_EVENT, callback);
    }

    addCreateFailEventListener(callback) {
        emitter.on(CREATE_FAIL_EVENT, callback);
    }

    removeCreateFailEventListener(callback) {
        emitter.removeListener(CREATE_FAIL_EVENT, callback);
    }

    addUpdateSuccessEventListener(callback) {
        emitter.on(UPDATE_SUCCESS_EVENT, callback);
    }

    removeUpdateSuccessEventListener(callback) {
        emitter.removeListener(UPDATE_SUCCESS_EVENT, callback);
    }

    addUpdateFailEventListener(callback) {
        emitter.on(UPDATE_FAIL_EVENT, callback);
    }

    removeUpdateFailEventListener(callback) {
        emitter.removeListener(UPDATE_FAIL_EVENT, callback);
    }

    addDeleteSuccessEventListener(callback) {
        emitter.on(DELETE_SUCCESS_EVENT, callback);
    }

    removeDeleteSuccessEventListener(callback) {
        emitter.removeListener(DELETE_SUCCESS_EVENT, callback);
    }

    addDeleteFailEventListener(callback) {
        emitter.on(DELETE_FAIL_EVENT, callback);
    }

    removeDeleteFailEventListener(callback) {
        emitter.removeListener(DELETE_FAIL_EVENT, callback);
    }

    get dispatcherToken () {
        return dispatcherToken;
    }
}


export default new UserStore();