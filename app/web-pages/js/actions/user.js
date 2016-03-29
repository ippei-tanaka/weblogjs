import {
    loadUsersFromServer,
    editUserOnServer,
    createUserOnServer,
    deleteUserOnServer
} from '../utilities/web-api-utils';

import {
    LOADED_USER_RECEIVED,
    LOADING_USER_ERROR_RECEIVED,
    CREATED_USER_RECEIVED,
    CREATING_USER_ERROR_RECEIVED,
    EDITED_USER_RECEIVED,
    EDITING_USER_ERROR_RECEIVED,
    DELETED_USER_RECEIVED,
    DELETING_USER_ERROR_RECEIVED
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
            })
        } else {
            dispatch({
                type: LOADING_USER_ERROR_RECEIVED,
                errors
            })
        }
    });
};

export const createUser = (newUser) => (dispatch, getState) => {

    const users = getState().user.get('users');

    co(function* () {
        const { user, errors } = yield createUserOnServer({data: newUser});

        if (!errors) {
            dispatch({
                type: CREATED_USER_RECEIVED,
                user
            })
        } else {
            dispatch({
                type: CREATING_USER_ERROR_RECEIVED,
                errors
            })
        }
    });
};

export const editUser = ({id, data}) => (dispatch, getState) => {

    const users = getState().user.get('users');

    co(function* () {
        const { user, errors } = yield editUserOnServer({id, data});

        if (!errors) {
            dispatch({
                type: EDITED_USER_RECEIVED,
                user
            })
        } else {
            dispatch({
                type: EDITING_USER_ERROR_RECEIVED,
                errors
            })
        }
    });
};

export const deleteUser = ({id}) => (dispatch, getState) => {

    const users = getState().user.get('users');

    co(function* () {
        const { errors } = yield deleteUserOnServer({id});

        if (!errors) {
            dispatch({
                type: DELETED_USER_RECEIVED,
                id
            })
        } else {
            dispatch({
                type: DELETING_USER_ERROR_RECEIVED,
                errors
            })
        }
    });
};
