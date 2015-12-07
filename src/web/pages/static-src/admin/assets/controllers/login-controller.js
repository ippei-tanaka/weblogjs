import ReactComponentMounter from "../services/react-component-mounter";
import GlobalEvent from '../services/global-events';
import LoginForm from '../components/login-form';

class LoginController {

    static start () {
        GlobalEvent.domReady.on(() => {
            var mounter = new ReactComponentMounter(LoginForm, 'login-form');
            mounter.mount();
        });
    }

}

export default LoginController;