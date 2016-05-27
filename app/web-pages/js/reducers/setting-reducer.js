import Immutable from 'immutable';

import {
    LOADED_SETTING_RECEIVED,
    EDITED_SETTING_RECEIVED
} from '../constants/action-types';

const initialState = null;

export default (state = initialState, action) => {

    switch (action.type) {

        case LOADED_SETTING_RECEIVED:
            return action.data;

        case EDITED_SETTING_RECEIVED:
            return action.data;

        default:
            return state;
    }
};