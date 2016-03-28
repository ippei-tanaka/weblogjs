import {
    loadUsersFromServer,
    editUserOnServer,
    createUserOnServer
} from '../utilities/web-api-utils';

import {
    USERS_LOAD_REQUEST,
    LOADED_USER_RECEIVED,
    USERS_CREATE_REQUEST,
    CREATED_USER_RECEIVED,
    USER_CREATE_ERROR_RECEIVED,
    USERS_EDIT_REQUEST,
    EDITED_USER_RECEIVED,
    USER_EDIT_ERROR_RECEIVED
} from '../constants/action-types';

import {
    UNINITIALIZED,
    LOADING_USERS,
    PROCESSING_USER_EDIT
} from '../constants/user-status';

import co from 'co';


const isProcessing = status =>
    status === PROCESSING_USER_EDIT
    || status === LOADING_USERS;


export const loadUsers = () => (dispatch, getState) => {

    const { user } = getState();

    const users = user.get('users');
    const status = user.get('status');

    if (isProcessing(status)) {
        return;
    }

    /*
    dispatch({
        type: USERS_LOAD_REQUEST
    });
    */

    co(function* () {
        var users = yield loadUsersFromServer();

        if (users) {
            dispatch({
                type: LOADED_USER_RECEIVED,
                users: users
            })
        } else {
            dispatch({
                type: LOADED_USER_RECEIVED,
                users: null
            })
        }
    });
};


export const createUser = (newUser) => (dispatch, getState) => {

    const { user } = getState();
    const status = user.get('status');

    if (isProcessing(status)) {
        return;
    }

    /*
    dispatch({
        type: USERS_EDIT_REQUEST
    });
    */

    co(function* () {
        const { user, errors } = yield createUserOnServer(newUser);

        if (!errors) {
            dispatch({
                type: CREATED_USER_RECEIVED,
                user
            })
        } else {
            dispatch({
                type: USER_CREATE_ERROR_RECEIVED,
                errors
            })
        }
    });
};


export const editUser = ({id, data}) => (dispatch, getState) => {

    const { user } = getState();
    const users = user.get('users');
    const status = user.get('status');

    if (isProcessing(status)) {
        return;
    }

    /*
    dispatch({
        type: USERS_EDIT_REQUEST
    });
    */

    co(function* () {
        const { user, errors } = yield editUserOnServer({id, data});

        if (!errors) {
            dispatch({
                type: EDITED_USER_RECEIVED,
                user
            })
        } else {
            dispatch({
                type: USER_EDIT_ERROR_RECEIVED,
                errors
            })
        }
    });
};
