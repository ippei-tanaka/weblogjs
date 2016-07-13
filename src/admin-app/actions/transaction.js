import {
    getFromServer,
    postOnServer,
    putOneOnServer,
    deleteOnServer
} from '../../utilities/web-api-utils';

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

const modify = ({actionId, action}) => (dispatch, getState) =>
{
    dispatch({
        type: TRANSACTION_REQUEST,
        id: actionId
    });

    return co(function* ()
    {
        const siteInfo = getState().adminSiteInfo.toJS();
        const { webProtocol, webHost, webPort, adminApiRoot } = siteInfo;
        const API_BASE = `${webProtocol}://${webHost}:${webPort}${adminApiRoot}`;
        const actionPayload = yield action({apiBase: API_BASE});

        dispatch(actionPayload);

        dispatch({
            type: TRANSACTION_RESOLVED,
            id: actionId
        });

    }).catch((errors) =>
    {
        dispatch({
            type: TRANSACTION_REJECTED,
            id: actionId,
            errors
        });
    });
};

const load = ({path, doneType, dataProcessor = d => d}) => modify({
    actionId: null,
    action: co.wrap(function* ({apiBase})
    {
        const response = yield getFromServer({path: `${apiBase}${path}`});
        return {
            type: doneType,
            data: dataProcessor(response)
        };
    })
});

const loadOne = load;

const loadMany = ({path, doneType}) => load({
    path,
    doneType,
    dataProcessor: data => data.items
});

const create = ({path, doneType, actionId, data}) => modify({
    actionId,
    action: co.wrap(function* ({apiBase})
    {
        const { _id } = yield postOnServer({data, path: `${apiBase}${path}`});
        const response = yield getFromServer({path: `${apiBase}${path}/${_id}`});
        return {
            type: doneType,
            data: response
        };
    })
});

const edit = ({path, doneType, actionId, id, data}) => modify({
    actionId,
    action: co.wrap(function* ({apiBase})
    {
        yield putOneOnServer({data, path: `${apiBase}${path}/${id}`});
        const response = yield getFromServer({path: `${apiBase}${path}/${id}`});
        return {
            type: doneType,
            data: response
        };
    })
});

const del = ({path, doneType, actionId, id}) => modify({
    actionId,
    action: co.wrap(function* ({apiBase})
    {
        yield deleteOnServer({path: `${apiBase}${path}/${id}`});
        return {
            type: doneType,
            id
        };
    })
});

//------------

export const finishTransaction = ({actionId}) => (dispatch, getState) =>
{
    if (!actionId) {
        throw new Error("actionId can't be empty.");
    }

    dispatch({
        type: TRANSACTION_FINISHED,
        id: actionId
    });
};

export const loadUsers = () => loadMany({
    path: "/users",
    doneType: LOADED_USER_RECEIVED
});

export const createUser = ({actionId, data}) => create({
    path: '/users',
    doneType: CREATED_USER_RECEIVED,
    actionId,
    data
});

export const editUser = ({actionId, id, data}) => edit({
    path: '/users',
    doneType: EDITED_USER_RECEIVED,
    actionId,
    data,
    id
});

export const deleteUser = ({actionId, id}) => del({
    path: '/users',
    doneType: DELETED_USER_RECEIVED,
    actionId,
    id
});

export const editUserPassword = ({actionId, id, data}) => modify({
    actionId,
    action: co.wrap(function* ({apiBase}) {
        yield putOneOnServer({data, path: `${apiBase}/users/${id}/password`});
        return {
            type: USER_PASSWORD_EDIT_COMPLETE
        };
    })
});

export const loadCategories =  () => loadMany({
    path: "/categories",
    doneType: LOADED_CATEGORY_RECEIVED
});

export const createCategory = ({actionId, data}) => create({
    path: '/categories',
    doneType: CREATED_CATEGORY_RECEIVED,
    actionId,
    data
});

export const editCategory = ({actionId, id, data}) => edit({
    path: '/categories',
    doneType: EDITED_CATEGORY_RECEIVED,
    actionId,
    data,
    id
});

export const deleteCategory = ({actionId, id}) => del({
    path: '/categories',
    doneType: DELETED_CATEGORY_RECEIVED,
    actionId,
    id
});

export const loadBlogs =  () => loadMany({
    path: "/blogs",
    doneType: LOADED_BLOG_RECEIVED
});

export const createBlog = ({actionId, data}) => create({
    path: '/blogs',
    doneType: CREATED_BLOG_RECEIVED,
    actionId,
    data
});

export const editBlog = ({actionId, id, data}) => edit({
    path: '/blogs',
    doneType: EDITED_BLOG_RECEIVED,
    actionId,
    data,
    id
});

export const deleteBlog = ({actionId, id}) => del({
    path: '/blogs',
    doneType: DELETED_BLOG_RECEIVED,
    actionId,
    id
});

export const loadPosts =  () => loadMany({
    path: "/posts",
    doneType: LOADED_POST_RECEIVED
});

export const createPost = ({actionId, data}) => create({
    path: '/posts',
    doneType: CREATED_POST_RECEIVED,
    actionId,
    data
});

export const editPost = ({actionId, id, data}) => edit({
    path: '/posts',
    doneType: EDITED_POST_RECEIVED,
    actionId,
    data,
    id
});

export const deletePost = ({actionId, id}) => del({
    path: '/posts',
    doneType: DELETED_POST_RECEIVED,
    actionId,
    id
});

export const loadSetting = () => modify({
    actionId: null,
    action: co.wrap(function* ({apiBase}) {
        const response = yield getFromServer({path: `${apiBase}/setting`});
        dispatch({
            type: LOADED_SETTING_RECEIVED,
            data: response
        });
    })
});

export const editSetting = ({actionId, data}) => modify({
    actionId,
    action: co.wrap(function* ({apiBase}) {
        yield putOneOnServer({data, path: `${apiBase}/setting`});
        const response = yield getFromServer({path: `${apiBase}/setting`});
        dispatch({
            type: EDITED_SETTING_RECEIVED,
            data: response
        });
    })
});