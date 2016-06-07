import Immutable from 'immutable';

import {
    LOADED_BLOG_RECEIVED,
    CREATED_BLOG_RECEIVED,
    EDITED_BLOG_RECEIVED,
    DELETED_BLOG_RECEIVED
} from '../constants/action-types';

const initialState = Immutable.Map({});

export default (state = initialState, action) => {

    if (!(state instanceof Immutable.Map)) {
        state = Immutable.Map(state);
    }

    switch (action.type) {

        case LOADED_BLOG_RECEIVED:
            if (action.data) {
                action.data.forEach((data) => {
                    state = state.set(data._id, data);
                });
                return state;
            }
            return state;

        case CREATED_BLOG_RECEIVED:
            return state.set(action.data._id, action.data);

        case EDITED_BLOG_RECEIVED:
            return state.set(action.data._id, action.data);

        case DELETED_BLOG_RECEIVED:
            return state.delete(action.id);

        default:
            return state;
    }
};