import {
    TRANSACTION_INITIALIZE
} from '../constants/action-types';

export const initializeTransaction = () => (dispatch) => {
    dispatch({
        type: TRANSACTION_INITIALIZE
    });
};