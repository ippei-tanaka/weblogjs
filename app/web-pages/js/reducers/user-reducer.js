import Immutable from 'immutable';

import {
    USERS_LOAD_REQUEST,
    LOADED_USER_RECEIVED,
    USERS_EDIT_REQUEST,
    EDITED_USER_RECEIVED
} from '../constants/action-types';

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
    users: {}
});


export default (state = initialState, action) => {

    switch (action.type) {

        case USERS_LOAD_REQUEST:
            return state.set('status', LOADING_USERS);

        case LOADED_USER_RECEIVED:
            if (action.users) {

                let users = {};

                action.users.forEach((user) => {
                    users[user._id] = user;
                });

                users = new Immutable.Map(users);

                users = state.get('users').merge(users);

                return state
                    .set('users', users)
                    .set('status', USERS_LOAD_SUCCEEDED);
            } else {
                return state.set('status', USERS_LOAD_FAILED);
            }

        case USERS_EDIT_REQUEST:
            return state.set('status', PROCESSING_USER_EDIT);

        case EDITED_USER_RECEIVED:
            const users = state
                .get('users')
                .set(action.user._id, action.user);

            return state
                .set('users', users)
                .set('status', USER_EDIT_SUCCEEDED);

        default:
            return state;
    }
};