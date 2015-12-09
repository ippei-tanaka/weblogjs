import GlobalEvent from '../../services/global-events';
import Router from "../../services/router";
import Mounter from "../../services/react-component-mounter";
import Navigation from "../../components/navigation";
import DashboardController from "./dashboard-controller";
import UserController from "./user-controller";
//import CategoryController from "../controllers/category-controller";
//import PostController from "../controllers/post-controller";
//import BlogController from "../controllers/blog-controller";
import SettingController from "./setting-controller";

class HomeController {

    constructor () {
        this.userController = new UserController();

        this.userController.clickAddEvent.on(() => Router.changeHash("/users/new"));
        this.userController.clickEditEvent.on(id => Router.changeHash("/users/" + id));
        this.userController.clickDeleteEvent.on(id => Router.changeHash("/users/" + id + "/delete"));
        this.userController.completeAddEvent.on(() => Router.changeHash("/users"));
        this.userController.completeEditEvent.on(() => Router.changeHash("/users"));
        this.userController.completeDeleteEvent.on(() => Router.changeHash("/users"));
        this.userController.clickListLocation.on(() => Router.changeHash("/users"));


        // Routes

        Router.addRoute("/", () => DashboardController.showDashBoard());

        Router.addRoute("/users", () => this.userController.showList());
        Router.addRoute("/users/new", () => this.userController.showAdder());
        Router.addRoute("/users/:id", id => this.userController.showEditor(id));
        Router.addRoute("/users/:id/delete", id => this.userController.showDeleter(id));

    }

     showNavigation() {
        var navigationMounter;

        navigationMounter = new Mounter(
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

    start() {
        GlobalEvent.domReady.on(() => {
            this.showNavigation();

//--------------------------------
// Callbacks on Controllers
//--------------------------------

// UserController

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
             */

            // Setting

            Router.addRoute("/setting", function () {
                SettingController.showSettingEditor();
            });

            // Default

            Router.setDefaultRouteCallback(function () {
                Router.changeHash("/");
            });

            Router.listen(true);

        });

    }
}


export default HomeController;