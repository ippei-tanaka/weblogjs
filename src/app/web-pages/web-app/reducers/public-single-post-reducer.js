import Immutable from 'immutable';

import {
    LOADED_PUBLIC_SINGLE_POST_RECEIVED
} from '../constants/action-types';

const initialState = Immutable.Map({});

export default (state = initialState, action) => {

    if (!(state instanceof Immutable.Map)) {
        state = Immutable.Map(state);
    }

    switch (action.type) {

        case LOADED_PUBLIC_SINGLE_POST_RECEIVED:
            return Immutable.Map(action.data);

        default:
            return state;
    }
};