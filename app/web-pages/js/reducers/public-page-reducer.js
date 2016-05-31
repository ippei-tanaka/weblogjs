import {
    LOADED_FRONT_BLOG_RECEIVED,
    LOADED_POST_RECEIVED
} from '../constants/action-types';

const initialState = {
    blog: {},
    posts: [],
    categories: []
};

export default (state = initialState, action) => {

    switch (action.type) {

        case LOADED_FRONT_BLOG_RECEIVED:
            if (action.data) {
                state['blog'] = action.data;
            }
            return state;

        case LOADED_POST_RECEIVED:
            if (action.data) {
                /*
                const posts = {};
                action.data.forEach((data) => {
                    posts[data._id] = data;
                });
                state['posts'] = posts;
                */
                state['posts'] = action.data;
            }
            return state;

        default:
            return state;
    }
};