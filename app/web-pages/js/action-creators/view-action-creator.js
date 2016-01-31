import Constants from '../constants';
import Dispatcher from '../dispatcher';
import WebApiUtils from '../utilities/web-api-utils';

var Actions = Constants.Actions;

export default {

    doSomething: () => (dispatch) => {
        var promise = new Promise((resolve, reject) => {
            setTimeout(() => {
                resolve({
                    type: 'SAY_SOMETHING'
                });
            }, 2000);
        });
        dispatch(promise);
    },

    /*

    requestCreateUser: ({token, data}) => (dispatch) => {
        //Dispatcher.handleViewAction({
        //    actionType: Actions.USER_CREATE_REQUEST
        //});
        console.log(1234);
        dispatch(WebApiUtils.createUser(data).then(user => ({

        })).catch(errors => ({

        })));
    },
    */

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
    },

    requestCreatePost: ({token, data}) => {
        Dispatcher.handleViewAction({
            actionType: Actions.POST_CREATE_REQUEST
        });
        WebApiUtils.createPost({token, data});
    },

    requestUpdatePost: ({token, id, data}) => {
        Dispatcher.handleViewAction({
            actionType: Actions.POST_UPDATE_REQUEST
        });
        WebApiUtils.updatePost({token, id, data});
    },

    requestDeletePost: ({token, id}) => {
        Dispatcher.handleViewAction({
            actionType: Actions.POST_DELETE_REQUEST
        });
        WebApiUtils.deletePost({token, id});
    },

    requestUpdateSetting: ({token, data}) => {
        Dispatcher.handleViewAction({
            actionType: Actions.SETTING_UPDATE_REQUEST
        });
        WebApiUtils.updateSetting({token, data});
    },

    requestLogin ({token, email, password}) {
        Dispatcher.handleViewAction({
            actionType: Actions.LOG_IN_REQUEST
        });
        WebApiUtils.login({token, email, password});
    },

    requestLogout ({token}) {
        Dispatcher.handleViewAction({
            actionType: Actions.LOG_OUT_REQUEST
        });
        WebApiUtils.logout({token});
    }
};
