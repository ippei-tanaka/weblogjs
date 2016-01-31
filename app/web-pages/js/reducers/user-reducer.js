import Immutable from 'immutable';

import {
    USERS_LOAD_REQUEST,
    USERS_LOAD_RESULT_RECEIVED,
    USERS_EDIT_REQUEST,
    USERS_EDIT_RESULT_RECEIVED
} from '../constants/user-action-types';

import {
    UNINITIALIZED,
    LOADING_USERS,
    USERS_LOAD_SUCCEEDED,
    USERS_LOAD_FAILED,
    PROCESSING_USER_EDIT,
    USER_EDIT_SUCCEEDED,
    USER_EDIT_FAILED
} from '../constants/user-status';


const initialState = Immutable.fromJS({
    status: UNINITIALIZED,
    users: []
});


export default (state = initialState, action) => {

    switch (action.type) {

        case USERS_LOAD_REQUEST:
            return state.set('status', LOADING_USERS);

        case USERS_LOAD_RESULT_RECEIVED:
            if (action.users) {
                let users = state.get('users');
                users = users.merge(action.users);
                return state
                    .set('users', users)
                    .set('status', USERS_LOAD_SUCCEEDED);
            } else {
                return state.set('status', USERS_LOAD_FAILED);
            }

        case USERS_EDIT_REQUEST:
            return state.set('status', PROCESSING_USER_EDIT);

        case USERS_EDIT_RESULT_RECEIVED:
            if (!action.errors && action.user) {
                return state
                    .updateIn(['users', action.user._id], val => action.user)
                    .set('status', USER_EDIT_SUCCEEDED);
            } else {
                return state.set('status', USER_EDIT_FAILED);
            }

        default:
            return state;
    }
};