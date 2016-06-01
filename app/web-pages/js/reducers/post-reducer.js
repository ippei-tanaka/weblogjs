import Immutable from 'immutable';

import {
    LOADED_POST_RECEIVED,
    CREATED_POST_RECEIVED,
    EDITED_POST_RECEIVED,
    DELETED_POST_RECEIVED
} from '../constants/action-types';

const initialState = Immutable.Map({});

export default (state = initialState, action) => {

    if (!(state instanceof Immutable.Map)) {
        state = Immutable.Map(state);
    }

    switch (action.type) {

        case LOADED_POST_RECEIVED:
            if (action.data) {
                action.data.forEach((data) => {
                    state = state.set(data._id, data);
                });
                return state;
            }
            return state;

        case CREATED_POST_RECEIVED:
            return state.set(action.data._id, action.data);

        case EDITED_POST_RECEIVED:
            return state.set(action.data._id, action.data);

        case DELETED_POST_RECEIVED:
            return state.delete(action.id);

        default:
            return state;
    }
};