import Immutable from 'immutable';

import {
    LOADED_FRONT_BLOG_RECEIVED,
    LOADED_POST_RECEIVED
} from '../constants/action-types';

const initialState = Immutable.Map({
    blog: {},
    posts: Immutable.Map({}),
    categories: {}
});

export default (state = initialState, action) => {

    switch (action.type) {

        case LOADED_FRONT_BLOG_RECEIVED:
            return state.set('blog', action.data);

        case LOADED_POST_RECEIVED:
            if (action.data) {
                const posts = {};
                action.data.forEach((data) => {
                    posts[data._id] = data;
                });
                state = state.set('posts', Immutable.Map(posts));
            }
            return state;

        default:
            return state;
    }
};