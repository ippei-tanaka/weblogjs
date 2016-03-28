import Immutable from 'immutable';

import {
    USER_CREATE_ERROR_RECEIVED,
    CREATED_USER_RECEIVED,
    USER_EDIT_ERROR_RECEIVED,
    EDITED_USER_RECEIVED,
    CLEAR_ERRORS
} from '../constants/action-types';

const initialState = Immutable.Map({
    user: {}
});


export default (state = initialState, action) => {

    switch (action.type) {
        case USER_CREATE_ERROR_RECEIVED:
        case USER_EDIT_ERROR_RECEIVED:
            return state
                .set('user', action.errors.errors);

        case CREATED_USER_RECEIVED:
        case EDITED_USER_RECEIVED:
            return state
                .set('user', {});

        case CLEAR_ERRORS:
            return initialState;

        default:
            return state;
    }
};