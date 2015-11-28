"use strict";

define([
    'services/extend'
], function (extend) {

    function ServerFacade() {
        this.urlBase = "/api/v1";
    }

    ServerFacade.prototype =
    {
        getCategories: function () {
            return this
                .ajaxRequest("/categories")
                .then(function (data) {
                    return data.items;
                });
        },

        getCategory: function (id) {
            return this
                .ajaxRequest("/categories/" + id);
        },

        createCategory: function (categoryObject) {
            return this
                .ajaxRequest("/categories/", {
                    data: categoryObject,
                    method: 'post'
                });
        },

        updateCategory: function (id, categoryObject) {
            return this
                .ajaxRequest("/categories/" + id, {
                    data: categoryObject,
                    method: 'put'
                });
        },

        deleteCategory: function (id) {
            return this
                .ajaxRequest("/categories/" + id, {
                    method: 'delete'
                });
        },

        getPosts: function () {
            return this
                .ajaxRequest("/posts")
                .then(function (data) {
                    return data.items;
                });
        },

        getPost: function (id) {
            return this
                .ajaxRequest("/posts/" + id);
        },

        createPost: function (postObject) {
            return this
                .ajaxRequest("/posts/", {
                    data: postObject,
                    method: 'post'
                });
        },

        updatePost: function (id, postObject) {
            return this
                .ajaxRequest("/posts/" + id, {
                    data: postObject,
                    method: 'put'
                });
        },

        deletePost: function (id) {
            return this
                .ajaxRequest("/posts/" + id, {
                    method: 'delete'
                });
        },

        getUsers: function () {
            return this
                .ajaxRequest("/users")
                .then(function (data) {
                    return data.items;
                });
        },

        getUser: function (id) {
            return this
                .ajaxRequest("/users/" + id);
        },

        createUser: function (userObject) {
            return this
                .ajaxRequest("/users/", {
                    data: userObject,
                    method: 'post'
                });
        },

        updateUser: function (id, userObject) {
            return this
                .ajaxRequest("/users/" + id, {
                    data: userObject,
                    method: 'put'
                });
        },

        deleteUser: function (id) {
            return this
                .ajaxRequest("/users/" + id, {
                    method: 'delete'
                });
        },

        getMe: function () {
            return this
                .ajaxRequest("/users/me");
        },

        ajaxRequest: function (uri, options) {
            options = extend({
                url: this.urlBase + uri,
                method: "get",
                dataType: 'json',
                cache: false
            }, options);

            return $.ajax(options);
        }
    };

    return new ServerFacade();
});
