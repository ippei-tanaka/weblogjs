import Constants from '../constants';
import Dispatcher from '../dispatcher';
import WebApiUtils from '../utilities/web-api-utils';

var Actions = Constants.Actions;

export default {

    requestLoadingUsers: () => {
        Dispatcher.handleViewAction({
            actionType: Actions.USERS_LOAD_REQUEST
        });
    },

    requestCreateUser: ({token, data}) => {
        Dispatcher.handleViewAction({
            actionType: Actions.USER_CREATE_REQUEST
        });
        WebApiUtils.createUser({token, data});
    },

    requestUpdateUser: ({token, id, data}) => {
        Dispatcher.handleViewAction({
            actionType: Actions.USER_UPDATE_REQUEST
        });
        WebApiUtils.updateUser({token, id, data});
    },

    requestDeleteUser: ({token, id}) => {
        Dispatcher.handleViewAction({
            actionType: Actions.USER_DELETE_REQUEST
        });
        WebApiUtils.deleteUser({token, id});
    }

};
