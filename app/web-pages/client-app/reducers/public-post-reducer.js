import Immutable from 'immutable';

import {
    LOADED_PUBLIC_POSTS_RECEIVED
} from '../constants/action-types';

const initialState = Immutable.Map({
    posts: Immutable.Map({}),
    totalPages: null
});

export default (state = initialState, action) => {

    if (!(state instanceof Immutable.Map)) {
        state = Immutable.Map(state);
        state = state.set('posts', Immutable.Map(state.get('posts')))
    }

    switch (action.type) {

        case LOADED_PUBLIC_POSTS_RECEIVED:
            let posts = Immutable.Map({});

            action.data.posts.forEach(p => {
                posts = posts.set(p._id, p);
            });

            state = state.set('posts', posts);

            state = state.set('totalPages', action.data.totalPages);

            return state;

        default:
            return state;
    }
};