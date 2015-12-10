import GlobalEvent from '../../services/global-events';
import Router from "../../services/router";
import Mounter from "../../services/react-component-mounter";
import Navigation from "../../components/navigation";
import DashboardController from "./dashboard-controller";
import UserController from "./user-controller";
import CategoryController from "./category-controller";
import PostController from "./post-controller";
import BlogController from "./blog-controller";
import SettingController from "./setting-controller";


class HomeController {

    constructor() {
        this.dashboardController = new DashboardController();
        this.userController = new UserController();
        this.categoryController = new CategoryController();
        this.postController = new PostController();
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

        this.postController.clickAddEvent.on(() => Router.changeHash("/posts/new"));
        this.postController.clickEditEvent.on(id => Router.changeHash("/posts/" + id));
        this.postController.clickDeleteEvent.on(id => Router.changeHash("/posts/" + id + "/delete"));
        this.postController.completeAddEvent.on(() => Router.changeHash("/posts"));
        this.postController.completeEditEvent.on(() => Router.changeHash("/posts"));
        this.postController.completeDeleteEvent.on(() => Router.changeHash("/posts"));
        this.postController.clickListLocation.on(() => Router.changeHash("/posts"));

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

        Router.addRoute("/posts", () => this.postController.showList());
        Router.addRoute("/posts/new", () => this.postController.showAdder());
        Router.addRoute("/posts/:id", id => this.postController.showEditor(id));
        Router.addRoute("/posts/:id/delete", id => this.postController.showDeleter(id));

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
            Router.listen(true);
        });
    }
}


export default HomeController;