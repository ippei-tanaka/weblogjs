import Immutable from 'immutable';

import {
    TRANSACTION_INITIALIZE,
    TRANSACTION_REQUEST,
    TRANSACTION_REJECTED,
    TRANSACTION_RESOLVED
} from '../constants/action-types';

import {
    INITIALIZED,
    PENDING,
    REJECTED,
    RESOLVED
} from '../constants/transaction-status';

const initialState = Immutable.Map({
    errors: {},
    status: INITIALIZED
});


export default (state = initialState, action) => {

    switch (action.type) {

        case TRANSACTION_INITIALIZE:
            return initialState;

        case TRANSACTION_REQUEST:
            return state.set('status', PENDING);

        case TRANSACTION_RESOLVED:
            if (state.get('status') !== PENDING) {
                return state;
            }
            return state
                .set('status', RESOLVED)
                .set('errors', {});

        case TRANSACTION_REJECTED:
            if (state.get('status') !== PENDING) {
                return state;
            }
            return state
                .set('status', REJECTED)
                .set('errors', action.errors);

        default:
            return state;
    }
};