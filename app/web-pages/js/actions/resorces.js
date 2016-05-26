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

const errorHandler = (dispatch) => (errors) => {
    dispatch({
        type: TRANSACTION_REJECTED,
        errors
    });
};

const modify = (dispatch, main) => {
    dispatch({
        type: TRANSACTION_REQUEST
    });
    return co(function* () {
        yield main();
        dispatch({
            type: TRANSACTION_RESOLVED
        });
    }).catch(errorHandler(dispatch));
};

const load = (path, doneType) => () => (dispatch, getState) => {
    return co(function* () {
        const response = yield getFromServer({path: `/${path}`});
        dispatch({
            type: doneType,
            data: response.items
        });
    }).catch(errorHandler(dispatch));
};

const create = (path, doneType) => (newUser) => (dispatch, getState) => {
    return modify(dispatch, () => co(function* () {
        let response = yield postOnServer({data: newUser, path: `/${path}`});
        response = yield getFromServer({path: `/${path}/${response._id}`});
        dispatch({
            type: doneType,
            data: response
        });
    }));
};

const edit = (path, doneType) => ({id, data}) => (dispatch, getState) => {
    return modify(dispatch, () => co(function* () {
        yield putOneOnServer({data, path: `/${path}/${id}`});
        const response = yield getFromServer({path: `/${path}/${id}`});
        dispatch({
            type: TRANSACTION_RESOLVED
        });
        dispatch({
            type: doneType,
            data: response
        });
    }));
};

const del = (path, doneType) => ({id}) => (dispatch, getState) => {
    return modify(dispatch, () => co(function* () {
        yield deleteOnServer({path: `/${path}/${id}`});
        dispatch({
            type: TRANSACTION_RESOLVED
        });
        dispatch({
            type: doneType,
            id
        });
    }));
};

export const loadUsers = load('users', LOADED_USER_RECEIVED);

export const createUser = create('users', CREATED_USER_RECEIVED);

export const editUser = edit('users', EDITED_USER_RECEIVED);

export const editUserPassword = ({id, data}) => (dispatch, getState) => {
    return modify(dispatch, () => co(function* () {
        yield putOneOnServer({data, path: `/users/${id}/password`});
        dispatch({
            type: TRANSACTION_RESOLVED
        });
        dispatch({
            type: USER_PASSWORD_EDIT_COMPLETE
        });
    }));
};

export const deleteUser = del('users', DELETED_USER_RECEIVED);