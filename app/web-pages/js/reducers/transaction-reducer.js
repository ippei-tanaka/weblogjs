import Immutable from 'immutable';

import {
    TRANSACTION_REQUEST,
    TRANSACTION_REJECTED,
    TRANSACTION_RESOLVED,
    TRANSACTION_FINISHED
} from '../constants/action-types';

import {
    PENDING,
    REJECTED,
    RESOLVED
} from '../constants/transaction-status';

const initialState = Immutable.Map({});

export default (state = initialState, action) => {

    //console.log(state.toArray());

    switch (action.type) {

        case TRANSACTION_REQUEST:
            const transaction = state.get(action.id) || Immutable.Map({status: null, errors: {}});
            return state
                .set(action.id, transaction.set('status', PENDING));

        case TRANSACTION_RESOLVED:
            return state
                .set(action.id, state
                        .get(action.id)
                        .set('status', RESOLVED)
                        .set('errors', {}));

        case TRANSACTION_REJECTED:
            return state
                .set(action.id, state
                    .get(action.id)
                    .set('status', REJECTED)
                    .set('errors', action.errors));

        case TRANSACTION_FINISHED:
            return state.delete(action.id);

        default:
            return state;
    }
};