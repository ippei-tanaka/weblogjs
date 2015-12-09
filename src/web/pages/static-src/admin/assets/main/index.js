import HomeController from "../controllers/home-controller";
import LoginController from "../controllers/login-controller";


window.WeblogJS =
{
    showHome: function () {
        (new HomeController()).start();
    },

    showLogin: function () {
        (new LoginController()).start();
    }
};