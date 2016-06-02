import Immutable from 'immutable';

import {
    LOADED_FRONT_BLOG_RECEIVED
} from '../constants/action-types';

const initialState = null;

export default (state = initialState, action) => {

    if (!(state instanceof Immutable.Map)) {
        state = Immutable.Map(state);
    }

    switch (action.type) {

        case LOADED_FRONT_BLOG_RECEIVED:
            return Immutable.Map(action.data || {});

        default:
            return state;
    }
};