import Constants from '../constants';
import Dispatcher from '../dispatcher';
import WebApiUtils from '../utilities/web-api-utils';

var Actions = Constants.Actions;

export default {

    requestCreateUser: ({token, data}) => {
        Dispatcher.handleViewAction({
            actionType: Actions.USER_CREATE_REQUEST
        });
        WebApiUtils.createUser({token, data});
    },

    requestUpdateUser: ({token, id, data}) => {
        Dispatcher.handleViewAction({
            actionType: Actions.USER_UPDATE_REQUEST
        });
        WebApiUtils.updateUser({token, id, data});
    },

    requestDeleteUser: ({token, id}) => {
        Dispatcher.handleViewAction({
            actionType: Actions.USER_DELETE_REQUEST
        });
        WebApiUtils.deleteUser({token, id});
    },

    requestCreateCategory: ({token, data}) => {
        Dispatcher.handleViewAction({
            actionType: Actions.CATEGORY_CREATE_REQUEST
        });
        WebApiUtils.createCategory({token, data});
    },

    requestUpdateCategory: ({token, id, data}) => {
        Dispatcher.handleViewAction({
            actionType: Actions.CATEGORY_UPDATE_REQUEST
        });
        WebApiUtils.updateCategory({token, id, data});
    },

    requestDeleteCategory: ({token, id}) => {
        Dispatcher.handleViewAction({
            actionType: Actions.CATEGORY_DELETE_REQUEST
        });
        WebApiUtils.deleteCategory({token, id});
    },

    requestCreateBlog: ({token, data}) => {
        Dispatcher.handleViewAction({
            actionType: Actions.BLOG_CREATE_REQUEST
        });
        WebApiUtils.createBlog({token, data});
    },

    requestUpdateBlog: ({token, id, data}) => {
        Dispatcher.handleViewAction({
            actionType: Actions.BLOG_UPDATE_REQUEST
        });
        WebApiUtils.updateBlog({token, id, data});
    },

    requestDeleteBlog: ({token, id}) => {
        Dispatcher.handleViewAction({
            actionType: Actions.BLOG_DELETE_REQUEST
        });
        WebApiUtils.deleteBlog({token, id});
    }

};
