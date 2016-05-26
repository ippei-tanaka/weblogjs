import Immutable from 'immutable';

import {
    LOADED_USER_RECEIVED,
    CREATED_USER_RECEIVED,
    EDITED_USER_RECEIVED,
    USER_PASSWORD_EDIT_COMPLETE,
    DELETED_USER_RECEIVED
} from '../constants/action-types';

const initialState = Immutable.Map({});

export default (state = initialState, action) => {

    const users = state.get('users');

    switch (action.type) {

        case LOADED_USER_RECEIVED:
            if (action.data) {
                action.data.forEach((data) => {
                    state = state.set(data._id, data);
                });
                return state;
            }
            return state;

        case CREATED_USER_RECEIVED:
            return state.set(action.data._id, action.data);

        case EDITED_USER_RECEIVED:
            return state.set(action.data._id, action.data);

        case USER_PASSWORD_EDIT_COMPLETE:
            return state;

        case DELETED_USER_RECEIVED:
            return state.delete(action.id);

        default:
            return state;
    }
};