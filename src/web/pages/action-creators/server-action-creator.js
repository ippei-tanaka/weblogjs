import Constants from '../constants';
import Dispatcher from '../dispatcher';


var Actions = Constants.Actions;


export default {

    receiveUsers: users => {
        Dispatcher.handleServerAction({
            actionType: Actions.USERS_LOADED,
            data: users
        });
    },

    receiveCreatedUser: ({user, token}) => {
        Dispatcher.handleServerAction({
            actionType: Actions.USER_CREATED,
            data: user,
            token: token
        });
    },

    receiveErrorOnCreatingUser: ({error, token}) => {
        Dispatcher.handleServerAction({
            actionType: Actions.USER_CREATE_FAILED,
            data: error,
            token: token
        });
    },

    receiveUpdatedUser: ({user, token}) => {
        Dispatcher.handleServerAction({
            actionType: Actions.USER_UPDATED,
            data: user,
            token: token
        });
    },

    receiveErrorOnUpdatingUser: ({error, token}) => {
        Dispatcher.handleServerAction({
            actionType: Actions.USER_UPDATE_FAILED,
            data: error,
            token: token
        });
    },

    receiveDeletedUser: ({id, token}) => {
        Dispatcher.handleServerAction({
            actionType: Actions.USER_DELETED,
            data: id,
            token: token
        });
    },

    receiveErrorOnDeletingUser: ({errors, token}) => {
        Dispatcher.handleServerAction({
            actionType: Actions.USER_DELETE_FAILED,
            data: errors,
            token: token
        });
    },



    receiveCategories: categories => {
        Dispatcher.handleServerAction({
            actionType: Actions.CATEGORIES_LOADED,
            data: categories
        });
    },

    receiveCreatedCategory: ({category, token}) => {
        Dispatcher.handleServerAction({
            actionType: Actions.CATEGORY_CREATED,
            data: category,
            token: token
        });
    },

    receiveErrorOnCreatingCategory: ({error, token}) => {
        Dispatcher.handleServerAction({
            actionType: Actions.CATEGORY_CREATE_FAILED,
            data: error,
            token: token
        });
    },

    receiveUpdatedCategory: ({category, token}) => {
        Dispatcher.handleServerAction({
            actionType: Actions.CATEGORY_UPDATED,
            data: category,
            token: token
        });
    },

    receiveErrorOnUpdatingCategory: ({error, token}) => {
        Dispatcher.handleServerAction({
            actionType: Actions.CATEGORY_UPDATE_FAILED,
            data: error,
            token: token
        });
    },

    receiveDeletedCategory: ({id, token}) => {
        Dispatcher.handleServerAction({
            actionType: Actions.CATEGORY_DELETED,
            data: id,
            token: token
        });
    },

    receiveErrorOnDeletingCategory: ({errors, token}) => {
        Dispatcher.handleServerAction({
            actionType: Actions.CATEGORY_DELETE_FAILED,
            data: errors,
            token: token
        });
    },



    receiveBlogs: blogs => {
        Dispatcher.handleServerAction({
            actionType: Actions.BLOGS_LOADED,
            data: blogs
        });
    },

    receiveCreatedBlog: ({blog, token}) => {
        Dispatcher.handleServerAction({
            actionType: Actions.BLOG_CREATED,
            data: blog,
            token: token
        });
    },

    receiveErrorOnCreatingBlog: ({error, token}) => {
        Dispatcher.handleServerAction({
            actionType: Actions.BLOG_CREATE_FAILED,
            data: error,
            token: token
        });
    },

    receiveUpdatedBlog: ({blog, token}) => {
        Dispatcher.handleServerAction({
            actionType: Actions.BLOG_UPDATED,
            data: blog,
            token: token
        });
    },

    receiveErrorOnUpdatingBlog: ({error, token}) => {
        Dispatcher.handleServerAction({
            actionType: Actions.BLOG_UPDATE_FAILED,
            data: error,
            token: token
        });
    },

    receiveDeletedBlog: ({id, token}) => {
        Dispatcher.handleServerAction({
            actionType: Actions.BLOG_DELETED,
            data: id,
            token: token
        });
    },

    receiveErrorOnDeletingBlog: ({errors, token}) => {
        Dispatcher.handleServerAction({
            actionType: Actions.BLOG_DELETE_FAILED,
            data: errors,
            token: token
        });
    },

};