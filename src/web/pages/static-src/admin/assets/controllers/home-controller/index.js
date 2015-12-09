import GlobalEvent from '../../services/global-events';
import Router from "../../services/router";
import Mounter from "../../services/react-component-mounter";
import Navigation from "../../components/navigation";
import DashboardController from "./dashboard-controller";
import UserController from "./user-controller";
import CategoryController from "./category-controller";
//import PostController from "../controllers/post-controller";
import BlogController from "./blog-controller";
import SettingController from "./setting-controller";


class HomeController {

    constructor() {
        this.dashboardController = new DashboardController();
        this.userController = new UserController();
        this.categoryController = new CategoryController();
        this.blogController = new BlogController();
        this.settingController = new SettingController();

        this.userController.clickAddEvent.on(() => Router.changeHash("/users/new"));
        this.userController.clickEditEvent.on(id => Router.changeHash("/users/" + id));
        this.userController.clickDeleteEvent.on(id => Router.changeHash("/users/" + id + "/delete"));
        this.userController.completeAddEvent.on(() => Router.changeHash("/users"));
        this.userController.completeEditEvent.on(() => Router.changeHash("/users"));
        this.userController.completeDeleteEvent.on(() => Router.changeHash("/users"));
        this.userController.clickListLocation.on(() => Router.changeHash("/users"));

        this.categoryController.clickAddEvent.on(() => Router.changeHash("/categories/new"));
        this.categoryController.clickEditEvent.on(id => Router.changeHash("/categories/" + id));
        this.categoryController.clickDeleteEvent.on(id => Router.changeHash("/categories/" + id + "/delete"));
        this.categoryController.completeAddEvent.on(() => Router.changeHash("/categories"));
        this.categoryController.completeEditEvent.on(() => Router.changeHash("/categories"));
        this.categoryController.completeDeleteEvent.on(() => Router.changeHash("/categories"));
        this.categoryController.clickListLocation.on(() => Router.changeHash("/categories"));

        this.blogController.clickAddEvent.on(() => Router.changeHash("/blogs/new"));
        this.blogController.clickEditEvent.on(id => Router.changeHash("/blogs/" + id));
        this.blogController.clickDeleteEvent.on(id => Router.changeHash("/blogs/" + id + "/delete"));
        this.blogController.completeAddEvent.on(() => Router.changeHash("/blogs"));
        this.blogController.completeEditEvent.on(() => Router.changeHash("/blogs"));
        this.blogController.completeDeleteEvent.on(() => Router.changeHash("/blogs"));
        this.blogController.clickListLocation.on(() => Router.changeHash("/blogs"));

        // Routes

        Router.addRoute("/", () => this.dashboardController.showDashBoard());

        Router.addRoute("/users", () => this.userController.showList());
        Router.addRoute("/users/new", () => this.userController.showAdder());
        Router.addRoute("/users/:id", id => this.userController.showEditor(id));
        Router.addRoute("/users/:id/delete", id => this.userController.showDeleter(id));

        Router.addRoute("/categories", () => this.categoryController.showList());
        Router.addRoute("/categories/new", () => this.categoryController.showAdder());
        Router.addRoute("/categories/:id", id => this.categoryController.showEditor(id));
        Router.addRoute("/categories/:id/delete", id => this.categoryController.showDeleter(id));

        Router.addRoute("/blogs", () => this.blogController.showList());
        Router.addRoute("/blogs/new", () => this.blogController.showAdder());
        Router.addRoute("/blogs/:id", id => this.blogController.showEditor(id));
        Router.addRoute("/blogs/:id/delete", id => this.blogController.showDeleter(id));

        Router.addRoute("/setting", () => this.settingController.showEditor());

        Router.setDefaultRouteCallback(() => Router.changeHash("/"));

    }

    showNavigation() {
        var navigationMounter = new Mounter(
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

            Router.listen(true);

        });

    }
}


export default HomeController;