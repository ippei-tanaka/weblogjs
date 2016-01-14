import Constants from '../constants';
import Dispatcher from '../dispatcher';


var Actions = Constants.Actions;


export default {

    receiveUsers: users => {
        Dispatcher.handleServerAction({
            actionType: Actions.USERS_LOADED,
            data: users
        });
    },

    receiveCreatedUser: ({user, token}) => {
        Dispatcher.handleServerAction({
            actionType: Actions.USER_CREATED,
            data: user,
            token: token
        });
    },

    receiveErrorOnCreatingUser: ({error, token}) => {
        Dispatcher.handleServerAction({
            actionType: Actions.USER_CREATE_FAILED,
            data: error,
            token: token
        });
    },

    receiveUpdatedUser: ({user, token}) => {
        Dispatcher.handleServerAction({
            actionType: Actions.USER_UPDATED,
            data: user,
            token: token
        });
    },

    receiveErrorOnUpdatingUser: ({error, token}) => {
        Dispatcher.handleServerAction({
            actionType: Actions.USER_UPDATE_FAILED,
            data: error,
            token: token
        });
    },

    receiveDeletedUser: ({id, token}) => {
        Dispatcher.handleServerAction({
            actionType: Actions.USER_DELETED,
            data: id,
            token: token
        });
    },

    receiveErrorOnDeletingUser: ({errors, token}) => {
        Dispatcher.handleServerAction({
            actionType: Actions.USER_DELETE_FAILED,
            data: errors,
            token: token
        });
    }

};