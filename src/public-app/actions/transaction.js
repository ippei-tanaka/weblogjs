import {
    getFromServer,
    postOnServer,
    putOneOnServer,
    deleteOnServer
} from '../../utilities/web-api-utils';

import {
    LOADED_FRONT_BLOG_RECEIVED,
    LOADED_PUBLIC_CATEGORIES_RECEIVED,
    LOADED_PUBLIC_POSTS_RECEIVED,
    LOADED_PUBLIC_SINGLE_POST_RECEIVED,
    TRANSACTION_REQUEST,
    TRANSACTION_REJECTED,
    TRANSACTION_RESOLVED,
    TRANSACTION_FINISHED
} from '../constants/action-types';

import co from 'co';

const modify = (dispatch, actionId, main) => {

    dispatch({
        type: TRANSACTION_REQUEST,
        id: actionId
    });

    return co(function* () {
        yield main();

        dispatch({
            type: TRANSACTION_RESOLVED,
            id: actionId
        });
    }).catch((errors) => {
        dispatch({
            type: TRANSACTION_REJECTED,
            id: actionId,
            errors
        });
    });
};

const load = (processData, path, doneType) => () => (dispatch, getState) => {
    return modify(dispatch, null, () => co(function* () {
        const response = yield getFromServer({path});
        dispatch({
            type: doneType,
            data: processData(response)
        });
    }));
};

const loadOne = load.bind(null, (response) => response);

//------------

export const loadPublicPosts = ({apiRoot, category, tag, page} = {}) => {
    const categoryQuery = category ? `/category/${category}` : "";
    const tagQuery = tag ? `/tag/${tag}` : "";
    const pageQuery = page ? `/page/${page}` : "";
    return load((response) => ({ posts: response.items, totalPages: response.totalPages }),
        `${apiRoot}${categoryQuery}${tagQuery}/posts${pageQuery}`,
        LOADED_PUBLIC_POSTS_RECEIVED
    )();
};

export const loadPublicSinglePost = ({apiRoot, id}) => {
    return loadOne(`${apiRoot}/post/${id}`, LOADED_PUBLIC_SINGLE_POST_RECEIVED)();
};

export const loadPublicFrontBlog = ({apiRoot}) => {
    return loadOne(`${apiRoot}/front-blog`, LOADED_FRONT_BLOG_RECEIVED)();
};

export const loadPublicCategories = ({apiRoot}) => {
    return loadOne(`${apiRoot}/categories`, LOADED_PUBLIC_CATEGORIES_RECEIVED)();
};