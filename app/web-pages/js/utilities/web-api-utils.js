import ajax from "./ajax";
//import ServerActionCreator from "../action-creators/server-action-creator";

const URL_BASE = "/api";

var ajaxRestfulAPI = (uri, options) => {
    options = Object.assign({
        url: URL_BASE + uri,
        method: "get"
    }, options);
    return ajax(options);
};

/*
export default {

    loadUsers: () => {
        ajaxRestfulAPI("/users")
            .then(data => ServerActionCreator.receiveUsers(data.items));
    },

    createUser: ({token, data}) => {
        ajaxRestfulAPI("/users", {
            data: data,
            method: 'post'
        })
            .then(user => ServerActionCreator.receiveCreatedUser({user, token}))
            .catch(error => ServerActionCreator.receiveErrorOnCreatingUser({error, token}));
    },

    updateUser: ({token, id, data}) => {
        ajaxRestfulAPI("/users/" + id, {
            data: data,
            method: 'put'
        })
            .then(user => ServerActionCreator.receiveUpdatedUser({user, token}))
            .catch(error => ServerActionCreator.receiveErrorOnUpdatingUser({error, token}));
    },

    deleteUser: ({token, id}) => {
        ajaxRestfulAPI("/users/" + id, {
            method: 'delete'
        })
            .then(() => ServerActionCreator.receiveDeletedUser({id, token}))
            .catch(error => ServerActionCreator.receiveErrorOnDeletingUser({error, token}));

    },

    loadCategories: () => {
        ajaxRestfulAPI("/categories")
            .then(data => ServerActionCreator.receiveCategories(data.items));
    },

    createCategory: ({token, data}) => {
        ajaxRestfulAPI("/categories", {
            data: data,
            method: 'post'
        })
            .then(category => ServerActionCreator.receiveCreatedCategory({category, token}))
            .catch(error => ServerActionCreator.receiveErrorOnCreatingCategory({error, token}));
    },

    updateCategory: ({token, id, data}) => {
        ajaxRestfulAPI("/categories/" + id, {
            data: data,
            method: 'put'
        })
            .then(category => ServerActionCreator.receiveUpdatedCategory({category, token}))
            .catch(error => ServerActionCreator.receiveErrorOnUpdatingCategory({error, token}));
    },

    deleteCategory: ({token, id}) => {
        ajaxRestfulAPI("/categories/" + id, {
            method: 'delete'
        })
            .then(() => ServerActionCreator.receiveDeletedCategory({id, token}))
            .catch(error => ServerActionCreator.receiveErrorOnDeletingCategory({error, token}));

    },

    loadBlogs: () => {
        ajaxRestfulAPI("/blogs")
            .then(data => ServerActionCreator.receiveBlogs(data.items));
    },

    createBlog: ({token, data}) => {
        ajaxRestfulAPI("/blogs", {
            data: data,
            method: 'post'
        })
            .then(blog => ServerActionCreator.receiveCreatedBlog({blog, token}))
            .catch(error => ServerActionCreator.receiveErrorOnCreatingBlog({error, token}));
    },

    updateBlog: ({token, id, data}) => {
        ajaxRestfulAPI("/blogs/" + id, {
            data: data,
            method: 'put'
        })
            .then(blog => ServerActionCreator.receiveUpdatedBlog({blog, token}))
            .catch(error => {
                ServerActionCreator.receiveErrorOnUpdatingBlog({error, token})
            });
    },

    deleteBlog: ({token, id}) => {
        ajaxRestfulAPI("/blogs/" + id, {
            method: 'delete'
        })
            .then(() => ServerActionCreator.receiveDeletedBlog({id, token}))
            .catch(error => ServerActionCreator.receiveErrorOnDeletingBlog({error, token}));

    },

    loadPosts: () => {
        ajaxRestfulAPI("/posts")
            .then(data => ServerActionCreator.receivePosts(data.items));
    },

    createPost: ({token, data}) => {
        ajaxRestfulAPI("/posts", {
            data: data,
            method: 'post'
        })
            .then(post => ServerActionCreator.receiveCreatedPost({post, token}))
            .catch(error => ServerActionCreator.receiveErrorOnCreatingPost({error, token}));
    },

    updatePost: ({token, id, data}) => {
        ajaxRestfulAPI("/posts/" + id, {
            data: data,
            method: 'put'
        })
            .then(post => ServerActionCreator.receiveUpdatedPost({post, token}))
            .catch(error => ServerActionCreator.receiveErrorOnUpdatingPost({error, token}));
    },

    deletePost: ({token, id}) => {
        ajaxRestfulAPI("/posts/" + id, {
            method: 'delete'
        })
            .then(() => ServerActionCreator.receiveDeletedPost({id, token}))
            .catch(error => ServerActionCreator.receiveErrorOnDeletingPost({error, token}));

    },


    loadSetting: () => {
        ajaxRestfulAPI("/setting")
            .then(data => ServerActionCreator.receiveSetting(data));
    },

    updateSetting: ({data, token}) => {
        ajaxRestfulAPI("/setting", {
            data: data,
            method: 'put'
        })
            .then(setting => ServerActionCreator.receiveUpdatedSetting({setting, token}))
            .catch(error => ServerActionCreator.receiveErrorOnUpdatingSetting({error, token}));
    },

    login: ({token, email, password}) => {

        ajaxRestfulAPI("/login", {
            data: {
                email: email,
                password: password
            },
            method: 'post'
        })
            .then(() => ServerActionCreator.receiveLoginSuccess({token}))
            .catch(() => ServerActionCreator.receiveLoginFailure({token}));

    },

    logout: ({token}) => {
        ajaxRestfulAPI("/logout")
            .then(() => ServerActionCreator.receiveLogoutSuccess({token}))
            .catch(() => ServerActionCreator.receiveLogoutFailure({token}));
    },

    checkAuthStatus: () => {
        ajaxRestfulAPI("/users/me")
            .then(loginUser => ServerActionCreator.receiveAuthStatus(loginUser))
            .catch(() => ServerActionCreator.receiveAuthStatus(null));
    }
};
*/

export const getLoginUser = () => ajaxRestfulAPI("/users/me")
    .then(loginUser => loginUser)
    .catch(() => null);


export const loginToAdmin = ({email, password}) => ajaxRestfulAPI("/login", {
    data: {email, password},
    method: 'post'
})
    .then(loginUser => loginUser)
    .catch(() => null);


export const logoutFromAdmin = () => ajaxRestfulAPI("/logout")
    .then(() => true)
    .catch(() => false);


export const loadUsersFromServer = () => ajaxRestfulAPI("/users")
    .then(data => ({users: data.items}))
    .catch(errors => ({errors}));

export const createUserOnServer = ({data}) =>
    ajaxRestfulAPI("/users", {
        data,
        method: 'post'
    })
        .then(user => ({user}))
        .catch(errors => ({errors}));

export const editUserOnServer = ({id, data}) =>
    ajaxRestfulAPI("/users/" + id, {
        data,
        method: 'put'
    })
        .then(user => ({user}))
        .catch(errors => ({errors}));

export const deleteUserOnServer = ({id}) =>
    ajaxRestfulAPI("/users/" + id, {
        method: 'delete'
    })
        .then(user => ({user}))
        .catch(errors => ({errors}));
