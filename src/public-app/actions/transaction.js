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

import { PUBLIC_API_PATH } from '../constants/config';

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

const loadMany = load.bind(null, (response) => response.items);

const create = (path, doneType) => (actionId, newUser) => (dispatch, getState) => {
    return modify(dispatch, actionId, () => co(function* () {
        let response = yield postOnServer({data: newUser, path});
        response = yield getFromServer({path: `${path}/${response._id}`});
        dispatch({
            type: doneType,
            data: response
        });
    }));
};

const edit = (path, doneType) => (actionId, {id, data}) => (dispatch, getState) => {
    return modify(dispatch, actionId, () => co(function* () {
        yield putOneOnServer({data, path: `${path}/${id}`});
        const response = yield getFromServer({path: `${path}/${id}`});
        dispatch({
            type: doneType,
            data: response
        });
    }));
};

const del = (path, doneType) => (actionId, {id}) => (dispatch, getState) => {
    return modify(dispatch, actionId, () => co(function* () {
        yield deleteOnServer({path: `${path}/${id}`});
        dispatch({
            type: doneType,
            id
        });
    }));
};

//------------

export const finishTransaction = (actionId) => (dispatch, getState) => {
    dispatch({
        type: TRANSACTION_FINISHED,
        id: actionId
    });
};

export const loadPublicPosts = ({category, tag, page} = {}) => {
    const categoryQuery = category ? `/category/${category}` : "";
    const tagQuery = tag ? `/tag/${tag}` : "";
    const pageQuery = page ? `/page/${page}` : "";
    return load((response) => ({ posts: response.items, totalPages: response.totalPages }),
        `${PUBLIC_API_PATH}${categoryQuery}${tagQuery}/posts${pageQuery}`,
        LOADED_PUBLIC_POSTS_RECEIVED
    )();
};

export const loadPublicSinglePost = (id) => {
    return loadOne(`${PUBLIC_API_PATH}/post/${id}`, LOADED_PUBLIC_SINGLE_POST_RECEIVED)();
};

export const loadPublicFrontBlog = loadOne(`${PUBLIC_API_PATH}/front-blog`, LOADED_FRONT_BLOG_RECEIVED);

export const loadPublicCategories = loadMany(`${PUBLIC_API_PATH}/categories`, LOADED_PUBLIC_CATEGORIES_RECEIVED);
