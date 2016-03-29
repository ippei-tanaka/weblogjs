import Immutable from 'immutable';

import {
    CREATING_USER_ERROR_RECEIVED,
    CREATED_USER_RECEIVED,
    EDITING_USER_ERROR_RECEIVED,
    EDITED_USER_RECEIVED,
    CLEAR_ERRORS
} from '../constants/action-types';

const initialState = Immutable.Map({
    user: {}
});


export default (state = initialState, action) => {

    switch (action.type) {
        case CREATING_USER_ERROR_RECEIVED:
        case EDITING_USER_ERROR_RECEIVED:
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