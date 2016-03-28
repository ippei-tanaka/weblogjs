import {
    CLEAR_ERRORS
} from '../constants/action-types';

export const clearErrors = () => (dispatch) => {
    dispatch({
        type: CLEAR_ERRORS
    });
};