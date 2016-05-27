import {
    getFromServer,
    postOnServer,
    putOneOnServer,
    deleteOnServer
} from '../utilities/web-api-utils';

import {
    LOADED_USER_RECEIVED,
    CREATED_USER_RECEIVED,
    EDITED_USER_RECEIVED,
    USER_PASSWORD_EDIT_COMPLETE,
    DELETED_USER_RECEIVED,

    LOADED_CATEGORY_RECEIVED,
    CREATED_CATEGORY_RECEIVED,
    EDITED_CATEGORY_RECEIVED,
    DELETED_CATEGORY_RECEIVED,

    LOADED_BLOG_RECEIVED,
    CREATED_BLOG_RECEIVED,
    EDITED_BLOG_RECEIVED,
    DELETED_BLOG_RECEIVED,

    LOADED_POST_RECEIVED,
    CREATED_POST_RECEIVED,
    EDITED_POST_RECEIVED,
    DELETED_POST_RECEIVED,

    LOADED_SETTING_RECEIVED,
    EDITED_SETTING_RECEIVED,

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

    co(function* () {
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

const load = (path, doneType) => (actionId) => (dispatch, getState) => {
    modify(dispatch, actionId, () => co(function* () {
        const response = yield getFromServer({path: `/${path}`});
        dispatch({
            type: doneType,
            data: response.items
        });
    }));
};

const create = (path, doneType) => (actionId, newUser) => (dispatch, getState) => {
    modify(dispatch, actionId, () => co(function* () {
        let response = yield postOnServer({data: newUser, path: `/${path}`});
        response = yield getFromServer({path: `/${path}/${response._id}`});
        dispatch({
            type: doneType,
            data: response
        });
    }));
};

const edit = (path, doneType) => (actionId, {id, data}) => (dispatch, getState) => {
    modify(dispatch, actionId, () => co(function* () {
        yield putOneOnServer({data, path: `/${path}/${id}`});
        const response = yield getFromServer({path: `/${path}/${id}`});
        dispatch({
            type: doneType,
            data: response
        });
    }));
};

const del = (path, doneType) => (actionId, {id}) => (dispatch, getState) => {
    modify(dispatch, actionId, () => co(function* () {
        yield deleteOnServer({path: `/${path}/${id}`});
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


export const loadUsers = load('users', LOADED_USER_RECEIVED);

export const createUser = create('users', CREATED_USER_RECEIVED);

export const editUser = edit('users', EDITED_USER_RECEIVED);

export const deleteUser = del('users', DELETED_USER_RECEIVED);

export const editUserPassword = (actionId, {id, data}) => (dispatch, getState) => {
    modify(dispatch, actionId, () => co(function* () {
        yield putOneOnServer({data, path: `/users/${id}/password`});
        dispatch({
            type: USER_PASSWORD_EDIT_COMPLETE
        });
    }));
};


export const loadCategories = load('categories', LOADED_CATEGORY_RECEIVED);

export const createCategory = create('categories', CREATED_CATEGORY_RECEIVED);

export const editCategory = edit('categories', EDITED_CATEGORY_RECEIVED);

export const deleteCategory = del('categories', DELETED_CATEGORY_RECEIVED);


export const loadBlogs = load('blogs', LOADED_BLOG_RECEIVED);

export const createBlog = create('blogs', CREATED_BLOG_RECEIVED);

export const editBlog = edit('blogs', EDITED_BLOG_RECEIVED);

export const deleteBlog = del('blogs', DELETED_BLOG_RECEIVED);


export const loadPosts = load('posts', LOADED_POST_RECEIVED);

export const createPost = create('posts', CREATED_POST_RECEIVED);

export const editPost = edit('posts', EDITED_POST_RECEIVED);

export const deletePost = del('posts', DELETED_POST_RECEIVED);

export const loadSetting = (actionId) => (dispatch, getState) => {
    modify(dispatch, actionId, () => co(function* () {
        const response = yield getFromServer({path: `/setting`});
        dispatch({
            type: LOADED_SETTING_RECEIVED,
            data: response
        });
    }));
};

export const editSetting  = (actionId, {data}) => (dispatch, getState) => {
    modify(dispatch, actionId, () => co(function* () {
        yield putOneOnServer({data, path: `/setting`});
        const response = yield getFromServer({path: `/setting`});
        dispatch({
            type: EDITED_SETTING_RECEIVED,
            data: response
        });
    }));
};
