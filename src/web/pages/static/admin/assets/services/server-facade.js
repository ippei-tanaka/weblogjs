"use strict";

define([
    'jquery',
    'services/extend'
], function ($, extend) {

    function ServerFacade() {
        this.urlBase = "/api/v1";
    }

    ServerFacade.prototype =
    {

        getBlogs: function () {
            return this
                .restfulAPI("/blogs")
                .then(function (data) {
                    return data.items;
                });
        },

        getBlog: function (id) {
            return this
                .restfulAPI("/blogs/" + id);
        },

        createBlog: function (blogObject) {
            return this
                .restfulAPI("/blogs/", {
                    data: blogObject,
                    method: 'post'
                });
        },

        updateBlog: function (id, blogObject) {
            return this
                .restfulAPI("/blogs/" + id, {
                    data: blogObject,
                    method: 'put'
                });
        },

        deleteBlog: function (id) {
            return this
                .restfulAPI("/blogs/" + id, {
                    method: 'delete'
                });
        },

        getCategories: function () {
            return this
                .restfulAPI("/categories")
                .then(function (data) {
                    return data.items;
                });
        },

        getCategory: function (id) {
            return this
                .restfulAPI("/categories/" + id);
        },

        createCategory: function (categoryObject) {
            return this
                .restfulAPI("/categories/", {
                    data: categoryObject,
                    method: 'post'
                });
        },

        updateCategory: function (id, categoryObject) {
            return this
                .restfulAPI("/categories/" + id, {
                    data: categoryObject,
                    method: 'put'
                });
        },

        deleteCategory: function (id) {
            return this
                .restfulAPI("/categories/" + id, {
                    method: 'delete'
                });
        },

        getPosts: function () {
            return this
                .restfulAPI("/posts")
                .then(function (data) {
                    return data.items;
                });
        },

        getPost: function (id) {
            return this
                .restfulAPI("/posts/" + id);
        },

        createPost: function (postObject) {
            return this
                .restfulAPI("/posts/", {
                    data: postObject,
                    method: 'post'
                });
        },

        updatePost: function (id, postObject) {
            return this
                .restfulAPI("/posts/" + id, {
                    data: postObject,
                    method: 'put'
                });
        },

        deletePost: function (id) {
            return this
                .restfulAPI("/posts/" + id, {
                    method: 'delete'
                });
        },

        getUsers: function () {
            return this
                .restfulAPI("/users")
                .then(function (data) {
                    return data.items;
                });
        },

        getUser: function (id) {
            return this
                .restfulAPI("/users/" + id);
        },

        getMe: function () {
            return this
                .restfulAPI("/users/me");
        },

        createUser: function (userObject) {
            return this
                .restfulAPI("/users/", {
                    data: userObject,
                    method: 'post'
                });
        },

        updateUser: function (id, userObject) {
            return this
                .restfulAPI("/users/" + id, {
                    data: userObject,
                    method: 'put'
                });
        },

        deleteUser: function (id) {
            return this
                .restfulAPI("/users/" + id, {
                    method: 'delete'
                });
        },

        getSetting: function () {
            return this
                .restfulAPI("/setting");
        },

        updateSetting: function (settingObject) {
            return this
                .restfulAPI("/setting", {
                    data: settingObject,
                    method: 'put'
                });
        },

        login: function (email, password) {
            return this
                .admin("/login", {
                    data: {
                        email: email,
                        password: password
                    },
                    method: 'post'
                });
        },

        restfulAPI: function (uri, options) {
            options = extend({
                url: this.urlBase + uri,
                method: "get",
                dataType: 'json',
                cache: false
            }, options);

            return $.ajax(options);
        },

        admin: function (uri, options) {
            options = extend({
                url: "/admin" + uri,
                method: "get",
                dataType: 'json',
                cache: false
            }, options);

            return $.ajax(options);
        }
    };

    return new ServerFacade();
});
