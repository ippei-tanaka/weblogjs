"use strict";

requirejs([
        'services/router',
        'services/react-component-mounter',
        'jsx!components/navigation',
        'controllers/user-controller',
        'controllers/home-controller'
    ],
    function (Router,
              ReactComponentMounter,
              Navigation,
              UserController,
              HomeController) {

        var navigationMounter = new ReactComponentMounter(
            Navigation,
            'navigation',
            {
                hrefs: {
                    logout: "/admin/logout",
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

        Router.setDefaultRouteCallback(function () {
            Router.changeHash("/");
        });

        Router.listen(true);
    });
