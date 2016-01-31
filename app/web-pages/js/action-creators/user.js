import { loadUsersFromServer, editUserOnServer } from '../utilities/web-api-utils';

import {
    USERS_LOAD_REQUEST,
    USERS_LOAD_RESULT_RECEIVED,
    USERS_EDIT_REQUEST,
    USERS_EDIT_RESULT_RECEIVED
} from '../constants/user-action-types';

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

    dispatch({
        type: USERS_LOAD_REQUEST
    });

    co(function* () {
        var users = yield loadUsersFromServer();

        if (users) {
            dispatch({
                type: USERS_LOAD_RESULT_RECEIVED,
                users: users
            })
        } else {
            dispatch({
                type: USERS_LOAD_RESULT_RECEIVED,
                users: null
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

    dispatch({
        type: USERS_EDIT_REQUEST
    });

    co(function* () {
        const { user, errors } = yield editUserOnServer({id, data});
        dispatch({
            type: USERS_EDIT_RESULT_RECEIVED,
            user,
            errors
        })
    });
};


/*
 export const requestLogin = ({email, password}) => (dispatch, getState) => {

 const { auth } = getState();
 const status = auth.get('status');

 if (status === WAITING_FOR_STATUS_CHECK
 || status === WAITING_FOR_LOGIN
 || status === WAITING_FOR_LOGOUT) {
 return;
 }

 dispatch({
 type: LOGIN_REQUEST
 });

 co(function* () {
 let user = yield getLoginUser();

 if (user) {
 dispatch({
 type: LOGIN_RESULT_RECEIVED,
 user: user
 });
 return;
 }

 user = yield loginToAdmin({email, password});

 dispatch({
 type: LOGIN_RESULT_RECEIVED,
 user: user || null
 });
 });
 };


 export const requestLogout = () => (dispatch, getState) => {

 const { auth } = getState();
 const status = auth.get('status');

 if (status === WAITING_FOR_STATUS_CHECK
 || status === WAITING_FOR_LOGIN
 || status === WAITING_FOR_LOGOUT) {
 return;
 }

 dispatch({
 type: LOGOUT_REQUEST
 });

 co(function* () {
 let user = yield getLoginUser();

 if (!user) {
 dispatch({
 type: LOGOUT_RESULT_RECEIVED,
 result: true
 });
 return;
 }

 dispatch({
 type: LOGOUT_RESULT_RECEIVED,
 result: yield logoutFromAdmin()
 })
 });

 };
 */