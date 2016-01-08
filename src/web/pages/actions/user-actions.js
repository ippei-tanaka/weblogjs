import { USER_CREATE, USER_UPDATE, USER_DELETE } from '../constants';
import AppDispatcher from '../dispatcher/app-dispatcher';

class UserActions {

    /**
     * @public
     * @param {object} user
     */
    create({token, data}) {
        AppDispatcher.handleViewAction({
            actionType: USER_CREATE,
            token: token,
            data: data
        });
    }

    /**
     * @public
     * @param {object} userData
     */
    update({id, token, data}) {
        AppDispatcher.handleViewAction({
            actionType: USER_UPDATE,
            token: token,
            id: id,
            data: data
        });
    }

    /**
     * @public
     * @param {string} id
     */
    del({id, token}) {
        AppDispatcher.handleViewAction({
            actionType: USER_DELETE,
            token: token,
            id: id
        });
    }

}

export default new UserActions();