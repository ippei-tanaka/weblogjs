import Immutable from 'immutable';

import {
    LOADED_FRONT_BLOG_RECEIVED,
    LOADED_POST_RECEIVED
} from '../constants/action-types';

const initialState = Immutable.Map({
    blog: {},
    posts: [],
    categories: []
});

export default (state = initialState, action) => {

    if (!(state instanceof Immutable.Map)) {
        state = Immutable.Map(state);
    }

    switch (action.type) {

        case LOADED_FRONT_BLOG_RECEIVED:
            return action.data ? state.set('blog', action.data) : state;

        case LOADED_POST_RECEIVED:
            return action.data ? state.set('posts', action.data) : state;

        default:
            return state;
    }
};