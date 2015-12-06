import Mounter from '../services/react-component-mounter';
import Dashboard from '../components/dashboard';

export default {
    showDashBoard: function () {
        new Mounter(Dashboard, 'main-content-container').mount();

        Mounter.unmountComponentsAt(
            Mounter.select('popup-container')
        );

        Mounter.unmountComponentsAt(
            Mounter.select('location-bar-container')
        );
    }
};