import EventEmitter from "events";
import appDispatcher from "../dispatcher/app-dispatcher";
import ServerFacade from '../services/server-facade';


const CHANGE_EVENT = 'change';


class UserStore extends EventEmitter {

    constructor () {
        super();

        this.dispatcherIndex = appDispatcher.register(payload => {
            var action = payload.action;
            var text;

            switch(action.actionType) {
                case TodoConstants.TODO_CREATE:
                    text = action.text.trim();
                    if (text !== '') {
                        create(text);
                        TodoStore.emitChange();
                    }
                    break;

                case TodoConstants.TODO_DESTROY:
                    destroy(action.id);
                    TodoStore.emitChange();
                    break;

                // add more cases for other actionTypes, like TODO_UPDATE, etc.
            }

            return true; // No errors. Needed by promise in Dispatcher.
        });
    }

    /**
     * Get the entire collection of users.
     * @return {Promise}
     */
    getAll () {
        return ServerFacade.getUsers();
    }

    emitChange() {
        this.emit(CHANGE_EVENT);
    }

    /**
     * @param {function} callback
     */
    addChangeListener(callback) {
        this.on(CHANGE_EVENT, callback);
    }

    /**
     * @param {function} callback
     */
    removeChangeListener(callback) {
        this.removeListener(CHANGE_EVENT, callback);
    }

}

export default new UserStore();