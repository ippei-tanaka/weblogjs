import Immutable from 'immutable';

import {
    LOADED_CATEGORY_RECEIVED,
    CREATED_CATEGORY_RECEIVED,
    EDITED_CATEGORY_RECEIVED,
    DELETED_CATEGORY_RECEIVED
} from '../constants/action-types';

const initialState = Immutable.Map({});

export default (state = initialState, action) => {

    switch (action.type) {

        case LOADED_CATEGORY_RECEIVED:
            if (action.data) {
                action.data.forEach((data) => {
                    state = state.set(data._id, data);
                });
                return state;
            }
            return state;

        case CREATED_CATEGORY_RECEIVED:
            return state.set(action.data._id, action.data);

        case EDITED_CATEGORY_RECEIVED:
            return state
                .set(action.data._id, action.data);

        case DELETED_CATEGORY_RECEIVED:
            return state
                .delete(action.id);

        default:
            return state;
    }
};