import Immutable from 'immutable';

import {
    AUTH_STATUS_CHECK_REQUEST,
    AUTH_STATUS_RECEIVED,
    LOGIN_REQUEST,
    LOGIN_RESULT_RECEIVED,
    LOGOUT_RESULT_RECEIVED
} from '../constants/action-types';

import {
    UNINITIALIZED,
    WAITING_FOR_STATUS_CHECK,
    WAITING_FOR_LOGIN,
    WAITING_FOR_LOGOUT,
    LOGIN_CONFIRMED,
    LOGOUT_CONFIRMED,
    LOGIN_SUCCEEDED,
    LOGIN_FAILED,
    LOGOUT_SUCCEEDED,
    LOGOUT_FAILED
} from '../constants/auth-status';


const initialState = Immutable.Map({
    status: UNINITIALIZED,
    user: null
});

export default (state = initialState, action) => {

    if (!(state instanceof Immutable.Map)) {
        state = Immutable.Map(state);
    }

    switch (action.type) {

        case AUTH_STATUS_CHECK_REQUEST:
            return state
                .set('status', WAITING_FOR_STATUS_CHECK);

        case AUTH_STATUS_RECEIVED:
            return state
                .set('status', action.user ? LOGIN_CONFIRMED : LOGOUT_CONFIRMED)
                .set('user', action.user || null);

        case LOGIN_REQUEST:
            return state
                .set('status', WAITING_FOR_LOGIN)
                .set('user', null);

        case LOGIN_RESULT_RECEIVED:
            return state
                .set('status', action.user ? LOGIN_SUCCEEDED : LOGIN_FAILED)
                .set('user', action.user || null);

        case LOGOUT_RESULT_RECEIVED:
            return state
                .set('status', action.result ? LOGOUT_SUCCEEDED : LOGOUT_FAILED)
                .set('user', null);

        default:
            return state;

    }
};