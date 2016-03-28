import Immutable from 'immutable';

import {
    USERS_LOAD_REQUEST,
    LOADED_USER_RECEIVED,
    USERS_EDIT_REQUEST,
    CREATED_USER_RECEIVED,
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

    const users = state.get('users');

    switch (action.type) {

        //case USERS_LOAD_REQUEST:
        //    return state.set('status', LOADING_USERS);

        case LOADED_USER_RECEIVED:
            if (action.users) {

                let newUsers = {};

                action.users.forEach((user) => {
                    newUsers[user._id] = user;
                });

                newUsers = new Immutable.Map(newUsers);

                return state
                    .set('users', users.merge(newUsers))
                    .set('status', USERS_LOAD_SUCCEEDED);
            } else {
                return state.set('status', USERS_LOAD_FAILED);
            }
            break;

        case CREATED_USER_RECEIVED:
            return state
                .set('users', users.set(action.user._id, action.user))
                .set('status', USER_EDIT_SUCCEEDED);

        case EDITED_USER_RECEIVED:
            return state
                .set('users', users.set(action.user._id, action.user))
                .set('status', USER_EDIT_SUCCEEDED);

        default:
            return state;
    }
};