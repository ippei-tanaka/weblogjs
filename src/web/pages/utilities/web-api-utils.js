import ajax from "./ajax";
import ServerActions from "../actions/server-actions";

const URL_BASE = "/api/v1";

var ajaxRestfulAPI = (uri, options) => {
    options = Object.assign({
        url: URL_BASE + uri,
        method: "get"
    }, options);
    return ajax(options);
};

export default {

    loadUsers: () => {
        ajaxRestfulAPI("/users")
            .then(data => ServerActions.receiveUsers(data.items));
    },

    createUser: ({token, data}) => {
        ajaxRestfulAPI("/users", {
            data: data,
            method: 'post'
        })
            .then(user => ServerActions.receiveCreatedUser({user, token}))
            .catch(error => ServerActions.receiveErrorOnCreatingUser({error, token}));
    },

    updateUser: ({token, id, data}) => {
        ajaxRestfulAPI("/users/" + id, {
            data: data,
            method: 'put'
        })
            .then(user => ServerActions.receiveUpdatedUser({user, token}))
            .catch(error => ServerActions.receiveErrorOnUpdatingUser({error, token}));
    },

    deleteUser: ({token, id}) => {
        ajaxRestfulAPI("/users/" + id, {
            method: 'delete'
        })
            .then(() => ServerActions.receiveDeletedUser({id, token}))
            .catch(error => ServerActions.receiveErrorOnDeletingUser({error, token}));

    }

};

/*
class WebApiUtils {

    constructor() {
        this.urlBase = "/api/v1";
    }

    getBlogs() {
        return this
            .restfulAPI("/blogs")
            .then(function (data) {
                return data.items;
            });
    }

    getBlog(id) {
        return this
            .restfulAPI("/blogs/" + id);
    }

    createBlog(blogObject) {
        return this
            .restfulAPI("/blogs/", {
                data: blogObject,
                method: 'post'
            });
    }

    updateBlog(id, blogObject) {
        return this
            .restfulAPI("/blogs/" + id, {
                data: blogObject,
                method: 'put'
            });
    }

    deleteBlog(id) {
        return this
            .restfulAPI("/blogs/" + id, {
                method: 'delete'
            });
    }

    getCategories() {
        return this
            .restfulAPI("/categories")
            .then(function (data) {
                return data.items;
            });
    }

    getCategory(id) {
        return this
            .restfulAPI("/categories/" + id);
    }

    createCategory(categoryObject) {
        return this
            .restfulAPI("/categories/", {
                data: categoryObject,
                method: 'post'
            });
    }

    updateCategory(id, categoryObject) {
        return this
            .restfulAPI("/categories/" + id, {
                data: categoryObject,
                method: 'put'
            });
    }

    deleteCategory(id) {
        return this
            .restfulAPI("/categories/" + id, {
                method: 'delete'
            });
    }

    getPosts() {
        return this
            .restfulAPI("/posts")
            .then(function (data) {
                return data.items;
            });
    }

    getPost(id) {
        return this
            .restfulAPI("/posts/" + id);
    }

    createPost(postObject) {
        return this
            .restfulAPI("/posts/", {
                data: postObject,
                method: 'post'
            });
    }

    updatePost(id, postObject) {
        return this
            .restfulAPI("/posts/" + id, {
                data: postObject,
                method: 'put'
            });
    }

    deletePost(id) {
        return this
            .restfulAPI("/posts/" + id, {
                method: 'delete'
            });
    }

    loadUsers() {
        this
            .restfulAPI("/users")
            .then(function (data) {
                return data.items;
            });
    }

    getUser(id) {
        return this
            .restfulAPI("/users/" + id);
    }

    getMe() {
        return this
            .restfulAPI("/users/me");
    }

    createUser(userObject) {
        return this
            .restfulAPI("/users/", {
                data: userObject,
                method: 'post'
            });
    }

    updateUser(id, userObject) {
        return this
            .restfulAPI("/users/" + id, {
                data: userObject,
                method: 'put'
            });
    }

    deleteUser(id) {
        return this
            .restfulAPI("/users/" + id, {
                method: 'delete'
            });
    }

    getSetting() {
        return this
            .restfulAPI("/setting");
    }

    updateSetting(settingObject) {
        return this
            .restfulAPI("/setting", {
                data: settingObject,
                method: 'put'
            });
    }

    getPrivileges() {
        return this
            .restfulAPI("/privileges");
    }

    login(email, password) {
        return this
            .restfulAPI("/login", {
                data: {
                    email: email,
                    password: password
                },
                method: 'post'
            });
    }

    logout() {
        return this.restfulAPI("/logout");
    }

    isLoggedIn() {
        return this.getMe("/").then(() => null);
    }



}

export default new WebApiUtils();
*/