import {
    getFromServer
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

const load = ({path, doneType, dataProcessor = d => d}) => (dispatch, getState) => co(function* ()
{
    const siteInfo = getState().publicSiteInfo.toJS();
    const { webProtocol, webHost, webPort, publicApiRoot } = siteInfo;
    const API_BASE = `${webProtocol}://${webHost}:${webPort}${publicApiRoot}`;

    dispatch({
        type: TRANSACTION_REQUEST
    });

    const response = yield getFromServer({path: `${API_BASE}${path}`});

    dispatch({
        type: doneType,
        data: dataProcessor(response)
    });

    dispatch({
        type: TRANSACTION_RESOLVED
    });

}).catch((errors) =>
{
    dispatch({
        type: TRANSACTION_REJECTED,
        errors
    });
});

const generatePublicPostPath = ({category, tag, page}) =>
{
    const categoryQuery = category ? `/category/${category}` : "";
    const tagQuery = tag ? `/tag/${tag}` : "";
    const pageQuery = page ? `/page/${page}` : "";
    return `${categoryQuery}${tagQuery}/posts${pageQuery}`;
};

//------------

export const loadPublicPosts = ({category, tag, page} = {}) => load({
    path: generatePublicPostPath({category, tag, page}),
    doneType: LOADED_PUBLIC_POSTS_RECEIVED,
    dataProcessor: (data) => ({posts: data.items, totalPages: data.totalPages})
});

export const loadPublicSinglePost = ({id}) => load({
    path: `/post/${id}`,
    doneType: LOADED_PUBLIC_SINGLE_POST_RECEIVED
});

export const loadPublicFrontBlog = () => load({
    path: `/front-blog`,
    doneType: LOADED_FRONT_BLOG_RECEIVED
});

export const loadPublicCategories = () => load({
    path: `/categories`,
    doneType: LOADED_PUBLIC_CATEGORIES_RECEIVED,
    dataProcessor: data => data.items
});