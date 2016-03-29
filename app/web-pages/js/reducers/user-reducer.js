import Immutable from 'immutable';

import {
    LOADED_USER_RECEIVED,
    CREATED_USER_RECEIVED,
    EDITED_USER_RECEIVED,
    DELETED_USER_RECEIVED
} from '../constants/action-types';

const initialState = Immutable.fromJS({
    users: {}
});

export default (state = initialState, action) => {

    const users = state.get('users');

    switch (action.type) {

        case LOADED_USER_RECEIVED:
            if (action.users) {

                let newUsers = {};

                action.users.forEach((user) => {
                    newUsers[user._id] = user;
                });

                newUsers = new Immutable.Map(newUsers);

                return state
                    .set('users', users.merge(newUsers));
            }
            return state;

        case CREATED_USER_RECEIVED:
            return state
                .set('users', users.set(action.user._id, action.user));

        case EDITED_USER_RECEIVED:
            return state
                .set('users', users.set(action.user._id, action.user));

        case DELETED_USER_RECEIVED:
            return state
                .set('users', users.delete(action.id));

        default:
            return state;
    }
};