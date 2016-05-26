import {
    getFromServer,
    postOnServer,
    putOneOnServer,
    deleteOnServer
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

const load = (path) => () => (dispatch, getState) => {
    co(function* () {
        const response = yield getFromServer({path: `/${path}`});
        dispatch({
            type: LOADED_USER_RECEIVED,
            users: response.items
        });
    }).catch((errors) => {
        dispatch({
            type: TRANSACTION_REJECTED,
            errors
        });
    });
};

const create = (path) => (newUser) => (dispatch, getState) => {
    dispatch({
        type: TRANSACTION_REQUEST
    });
    co(function* () {
        let response = yield postOnServer({data: newUser, path: `/${path}`});
        response = yield getFromServer({path: `/${path}/${response._id}`});

        dispatch({
            type: TRANSACTION_RESOLVED
        });
        dispatch({
            type: CREATED_USER_RECEIVED,
            user: response
        });
    }).catch((errors) => {
        dispatch({
            type: TRANSACTION_REJECTED,
            errors
        });
    });
};

const edit = (path) => ({id, data}) => (dispatch, getState) => {

    dispatch({
        type: TRANSACTION_REQUEST
    });

    co(function* () {
        yield putOneOnServer({data, path: `/${path}/${id}`});
        const response = yield getFromServer({path: `/${path}/${id}`});

        dispatch({
            type: TRANSACTION_RESOLVED
        });
        dispatch({
            type: EDITED_USER_RECEIVED,
            user: response
        });
    }).catch((errors) => {
        dispatch({
            type: TRANSACTION_REJECTED,
            errors
        });
    });
};

const del = (path) => ({id}) => (dispatch, getState) => {

    dispatch({
        type: TRANSACTION_REQUEST
    });

    co(function* () {
        yield deleteOnServer({path: `/${path}/${id}`});

        dispatch({
            type: TRANSACTION_RESOLVED
        });
        dispatch({
            type: DELETED_USER_RECEIVED,
            id
        });
    }).catch((errors) => {
        dispatch({
            type: TRANSACTION_REJECTED,
            errors
        });
    });
};

export const loadUsers = load('users');

export const createUser = create('users');

export const editUser = edit('users');

export const deleteUser = del('users');

export const editUserPassword = ({id, data}) => (dispatch, getState) => {

    dispatch({
        type: TRANSACTION_REQUEST
    });

    co(function* () {
        const { user, errors } = yield putOneOnServer({id, data, path: "users"});

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