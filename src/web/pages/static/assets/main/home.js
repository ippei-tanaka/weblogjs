"use strict";

requirejs([
        'services/router',
        'services/react-component-mounter',
        'jsx!components/navigation',
        'controllers/home-controller',
        'controllers/user-controller',
        'controllers/category-controller',
        'controllers/post-controller'
    ],
    function (Router,
              ReactComponentMounter,
              Navigation,
              HomeController,
              UserController,
              CategoryController,
              PostController) {

        var navigationMounter = new ReactComponentMounter(
            Navigation,
            'navigation',
            {
                hrefs: {
                    logout: "/admin/logout#",
                    dashboard: "#/",
                    users: "#/users",
                    categories: "#/categories",
                    posts: "#/posts"
                }
            });

        navigationMounter.mount();

        Router.addRoute("/", function () {
            HomeController.showDashBoard();
        });

        Router.addRoute("/users", function () {
            UserController.showUserList();
        });

        Router.addRoute("/categories", function () {
            CategoryController.showCategoryList();
        });

        Router.addRoute("/posts", function () {
            PostController.showPostList();
        });

        Router.setDefaultRouteCallback(function () {
            Router.changeHash("/");
        });

        Router.listen(true);
    });
