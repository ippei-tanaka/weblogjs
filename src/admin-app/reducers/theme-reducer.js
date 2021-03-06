import Immutable from 'immutable';

import {
    LOADED_THEMES_RECEIVED
} from '../constants/action-types';

const initialState = Immutable.Map({});

export default (state = initialState, action) => {

    if (!(state instanceof Immutable.Map)) {
        state = Immutable.Map(state);
    }

    switch (action.type) {

        case LOADED_THEMES_RECEIVED:
            if (action.data) {
                action.data.forEach((data) => {
                    state = state.set(data.name, data);
                });
                return state;
            }
            return state;
        default:
            return state;
    }
};