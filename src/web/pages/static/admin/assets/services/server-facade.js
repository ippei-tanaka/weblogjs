"use strict";

define(function () {

    function ServerFacade () {
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
                .ajaxRequest("/categories/" + id)
                .then(function (data) {
                    return data;
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
                .ajaxRequest("/posts/" + id)
                .then(function (data) {
                    return data;
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
                .ajaxRequest("/users/" + id)
                .then(function (data) {
                    return data;
                });
        },

        getMe: function () {
            return this
                .ajaxRequest("/users/me")
                .then(function (data) {
                    return data;
                });
        },

        ajaxRequest: function (uri) {
            return $.ajax({
                url: this.urlBase + uri,
                dataType: 'json',
                cache: false
            });
        }
    };

    return new ServerFacade();
});
