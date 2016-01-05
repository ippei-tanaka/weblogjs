import LocationBar  from '../../components/location-bar';
import Mounter      from '../../services/react-component-mounter';
import SettingEditor from "../../components/setting-editor";

class SettingController {

    constructor() {
        this._editorMounter = new Mounter(SettingEditor, 'main-content-container');
        this._locationBarMounter = new Mounter(LocationBar, 'location-bar-container');
    }

    get locations() {
        return [
            {
                label: "Home"
            },
            {
                label: "Setting Editor"
            }
        ];
    }

    showEditor() {
        this._editorMounter.mount();
        this._locationBarMounter.props.locations = this.locations;
        this._locationBarMounter.mount();
    }
}

export default SettingController;