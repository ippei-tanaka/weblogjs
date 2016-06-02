import Immutable from 'immutable';

import {
    LOADED_PUBLIC_POST_RECEIVED
} from '../constants/action-types';

const initialState = Immutable.Map({});

export default (state = initialState, action) => {

    if (!(state instanceof Immutable.Map)) {
        state = Immutable.Map(state);
    }

    switch (action.type) {

        case LOADED_PUBLIC_POST_RECEIVED:
            action.data.forEach(p => {
                state = state.set(p._id, p);
            });
            return state;

        default:
            return state;
    }
};