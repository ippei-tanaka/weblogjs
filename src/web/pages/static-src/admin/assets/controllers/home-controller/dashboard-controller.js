import Mounter from '../../services/react-component-mounter';
import Dashboard from '../../components/dashboard';


class SettingController {

    constructor() {
        this._dashboardMounter = new Mounter(Dashboard, 'main-content-container');
    }

    showDashBoard() {
        Mounter.unmountComponentsAt(
            Mounter.select('popup-container')
        );

        Mounter.unmountComponentsAt(
            Mounter.select('location-bar-container')
        );

        this._dashboardMounter.mount();
    }

}


export default SettingController;