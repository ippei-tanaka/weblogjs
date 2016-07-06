import { ADMIN_API_PATH } from '../constants/config';
import { getFromServer, postOnServer } from '../../utilities/web-api-utils';

import {
    AUTH_STATUS_CHECK_REQUEST,
    AUTH_STATUS_RECEIVED,
    LOGIN_REQUEST,
    LOGIN_RESULT_RECEIVED,
    LOGOUT_REQUEST,
    LOGOUT_RESULT_RECEIVED
} from '../constants/action-types';

import {
    WAITING_FOR_STATUS_CHECK,
    WAITING_FOR_LOGIN,
    WAITING_FOR_LOGOUT
} from '../constants/auth-status';

import co from 'co';

const getLoginUser = () =>
    getFromServer({
        path:`${ADMIN_API_PATH}/users/me`
    }).catch(() => null);

const loginToAdmin = ({email, password}) =>
    postOnServer({
        path:`${ADMIN_API_PATH}/login`,
        data: {email, password}
    }).catch(() => null);

const logoutFromAdmin = () =>
    getFromServer({
        path:`${ADMIN_API_PATH}/logout`
    }).then(() => true).catch(() => false);

export const checkStatus = () => (dispatch, getState) => {

    const { auth } = getState();
    const status = auth.get('status');

    if (status === WAITING_FOR_STATUS_CHECK
        || status === WAITING_FOR_LOGIN
        || status === WAITING_FOR_LOGOUT) {
        return;
    }

    /*
    dispatch({
        type: AUTH_STATUS_CHECK_REQUEST
    });
    */

    co(function* () {
        var user = yield getLoginUser();

        if (user) {
            dispatch({
                type: AUTH_STATUS_RECEIVED,
                user: user
            })
        } else {
            dispatch({
                type: AUTH_STATUS_RECEIVED,
                user: null
            })
        }
    });
};


export const requestLogin = ({email, password}) => (dispatch, getState) => {

    const { auth } = getState();
    const status = auth.get('status');

    if (status === WAITING_FOR_STATUS_CHECK
        || status === WAITING_FOR_LOGIN
        || status === WAITING_FOR_LOGOUT) {
        return;
    }

    /*
    dispatch({
        type: LOGIN_REQUEST
    });
    */

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

    /*
    dispatch({
        type: LOGOUT_REQUEST
    });
    */

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