import GlobalEvent from '../services/global-events';
import Router from "../services/router";
import ReactComponentMounter from "../services/react-component-mounter";
import Navigation from "../components/navigation";
import DashboardController from "../controllers/dashboard-controller";
import UserController from "../controllers/user-controller";
//import CategoryController from "../controllers/category-controller";
//import PostController from "../controllers/post-controller";
//import BlogController from "../controllers/blog-controller";
//import SettingController from "../controllers/setting-controller";

class HomeController {

    static showNavigation () {
        var navigationMounter;

        navigationMounter = new ReactComponentMounter(
            Navigation,
            'navigation',
            {
                hrefs: {
                    logout: "/admin/logout#",
                    dashboard: "#/",
                    users: "#/users",
                    categories: "#/categories",
                    posts: "#/posts",
                    blogs: "#/blogs",
                    setting: "#/setting"
                }
            });

        navigationMounter.mount();
    }

    static start () {
        GlobalEvent.domReady.on(() => {
            this.constructor.showNavigation();

//--------------------------------
// Callbacks on Controllers
//--------------------------------

// UserController
            UserController.onClickAddButton.on(function () {
                Router.changeHash("/users/new");
            });

            UserController.onClickEditButton.on(function (id) {
                Router.changeHash("/users/" + id);
            });

            UserController.onCompleteAdding.on(function () {
                Router.changeHash("/users");
            });

            UserController.onCompleteEditing.on(function () {
                Router.changeHash("/users");
            });

            UserController.onCompleteDeleting.on(function () {
                Router.changeHash("/users");
            });

            UserController.onClickListLocation.on(function () {
                Router.changeHash("/users");
            });
            /*

             // CategoryController

             CategoryController.onClickAddButton.on(function () {
             Router.changeHash("/categories/new");
             });

             CategoryController.onClickEditButton.on(function (id) {
             Router.changeHash("/categories/" + id);
             });

             CategoryController.onCompleteAdding.on(function () {
             Router.changeHash("/categories");
             });

             CategoryController.onCompleteEditing.on(function () {
             Router.changeHash("/categories");
             });

             CategoryController.onCompleteDeleting.on(function () {
             Router.changeHash("/categories");
             });

             CategoryController.onClickListLocation.on(function () {
             Router.changeHash("/categories");
             });

             // PostController

             PostController.onClickAddButton.on(function () {
             Router.changeHash("/posts/new");
             });

             PostController.onClickEditButton.on(function (id) {
             Router.changeHash("/posts/" + id);
             });

             PostController.onCompleteAdding.on(function () {
             Router.changeHash("/posts");
             });

             PostController.onCompleteEditing.on(function () {
             Router.changeHash("/posts");
             });

             PostController.onCompleteDeleting.on(function () {
             Router.changeHash("/posts");
             });

             PostController.onClickListLocation.on(function () {
             Router.changeHash("/posts");
             });

             // BlogController

             BlogController.onClickAddButton.on(function () {
             Router.changeHash("/blogs/new");
             });

             BlogController.onClickEditButton.on(function (id) {
             Router.changeHash("/blogs/" + id);
             });

             BlogController.onCompleteAdding.on(function () {
             Router.changeHash("/blogs");
             });

             BlogController.onCompleteEditing.on(function () {
             Router.changeHash("/blogs");
             });

             BlogController.onCompleteDeleting.on(function () {
             Router.changeHash("/blogs");
             });

             BlogController.onClickListLocation.on(function () {
             Router.changeHash("/blogs");
             });
             */

//--------------------------------
// Setting up the router
//--------------------------------

// Home

            Router.addRoute("/", function () {
                DashboardController.showDashBoard();
            });

// Users

            Router.addRoute("/users", function () {
                UserController.showUserList();
            });

            Router.addRoute("/users/new", function () {
                UserController.showUserEditorWithAddMode();
            });

            Router.addRoute("/users/:id", function (id) {
                UserController.showUserEditorWithEditMode(id);
            });
            /*

             // Categories

             Router.addRoute("/categories", function () {
             CategoryController.showCategoryList();
             });

             Router.addRoute("/categories/new", function () {
             CategoryController.showCategoryEditorWithAddMode();
             });

             Router.addRoute("/categories/:id", function (id) {
             CategoryController.showCategoryEditorWithEditMode(id);
             });

             // Posts

             Router.addRoute("/posts", function () {
             PostController.showPostList();
             });

             Router.addRoute("/posts/new", function () {
             PostController.showPostEditorWithAddMode();
             });

             Router.addRoute("/posts/:id", function (id) {
             PostController.showPostEditorWithEditMode(id);
             });

             // Blogs

             Router.addRoute("/blogs", function () {
             BlogController.showBlogList();
             });

             Router.addRoute("/blogs/new", function () {
             BlogController.showBlogEditorWithAddMode();
             });

             Router.addRoute("/blogs/:id", function (id) {
             BlogController.showBlogEditorWithEditMode(id);
             });

             // Blogs

             Router.addRoute("/setting", function () {
             SettingController.showSettingEditor();
             });
             */
// Default

            Router.setDefaultRouteCallback(function () {
                Router.changeHash("/");
            });

            Router.listen(true);

        });

    }
}


export default HomeController;