import {
    loadUsersFromServer,
    editUserOnServer,
    createUserOnServer,
    deleteUserOnServer
} from '../utilities/web-api-utils';

import {
    LOADED_USER_RECEIVED,
    CREATED_USER_RECEIVED,
    EDITED_USER_RECEIVED,
    USER_PASSWORD_EDIT_COMPLETE,
    DELETED_USER_RECEIVED,
    TRANSACTION_INITIALIZE,
    TRANSACTION_REQUEST,
    TRANSACTION_REJECTED,
    TRANSACTION_RESOLVED
} from '../constants/action-types';

import co from 'co';


export const loadUsers = () => (dispatch, getState) => {

    const users = getState().user.get('users');

    co(function* () {
        const { users, errors } = yield loadUsersFromServer();

        if (!errors) {
            dispatch({
                type: LOADED_USER_RECEIVED,
                users: users
            });
        } /* else {
            dispatch({
                type: TRANSACTION_REJECTED,
                errors
            });

        } */
    });
};

export const createUser = (newUser) => (dispatch, getState) => {

    const users = getState().user.get('users');

    dispatch({
        type: TRANSACTION_REQUEST
    });

    co(function* () {
        const { user, errors } = yield createUserOnServer({data: newUser});

        if (!errors) {
            dispatch({
                type: TRANSACTION_RESOLVED
            });
            dispatch({
                type: CREATED_USER_RECEIVED,
                user
            });
        } else {
            dispatch({
                type: TRANSACTION_REJECTED,
                errors
            });
        }
    });
};

export const editUser = ({id, data}) => (dispatch, getState) => {

    const users = getState().user.get('users');

    dispatch({
        type: TRANSACTION_REQUEST
    });

    co(function* () {
        const { user, errors } = yield editUserOnServer({id, data});

        if (!errors) {
            dispatch({
                type: TRANSACTION_RESOLVED
            });
            dispatch({
                type: EDITED_USER_RECEIVED,
                user
            });
        } else {
            dispatch({
                type: TRANSACTION_REJECTED,
                errors
            });
        }
    });
};


export const editUserPassword = ({id, data}) => (dispatch, getState) => {

    const users = getState().user.get('users');

    dispatch({
        type: TRANSACTION_REQUEST
    });

    co(function* () {
        const { user, errors } = yield editUserOnServer({id, data});

        if (!errors) {
            dispatch({
                type: TRANSACTION_RESOLVED
            });
            dispatch({
                type: USER_PASSWORD_EDIT_COMPLETE,
                user
            });
        } else {
            dispatch({
                type: TRANSACTION_REJECTED,
                errors
            });
        }
    });
};

export const deleteUser = ({id}) => (dispatch, getState) => {

    const users = getState().user.get('users');

    dispatch({
        type: TRANSACTION_REQUEST
    });

    co(function* () {
        const { errors } = yield deleteUserOnServer({id});

        if (!errors) {
            dispatch({
                type: TRANSACTION_RESOLVED
            });
            dispatch({
                type: DELETED_USER_RECEIVED,
                id
            })
        } else {
            dispatch({
                type: TRANSACTION_REJECTED,
                errors
            })
        }
    });
};
