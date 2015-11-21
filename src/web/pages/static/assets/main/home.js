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


        // Callbacks on list pages

        PostController.onClickAddButton.on(function () {
            Router.changeHash("/posts/new");
        });

        PostController.onClickEditButton.on(function (post) {
            Router.changeHash("/posts/" + post._id);
        });

        PostController.onCompleteAdding.on(function () {
            Router.changeHash("/posts/");
        });

        PostController.onCompleteEditing.on(function () {
            Router.changeHash("/posts/");
        });

        PostController.onCompleteDeleting.on(function () {
            Router.changeHash("/posts/");
        });


        // Setting up the router

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

        Router.addRoute("/posts/new", function () {
            PostController.showPostEditorWithAddMode();
        });

        Router.addRoute("/posts/:id", function (id) {
            PostController.showPostEditorWithEditMode(id);
        });

        Router.setDefaultRouteCallback(function () {
            Router.changeHash("/");
        });

        Router.listen(true);
    });
