import Mounter from "../../services/react-component-mounter";
import SettingEditor from "../../components/setting-editor";
import PopUp from "../../components/popup";
import LocationBar from "../../components/location-bar";


var settingEditorMounter;
var locationBarMounter;
var buildLocations;
var showSettingEditor;
var exports;


settingEditorMounter = new Mounter(
    SettingEditor, 'main-content-container');

locationBarMounter = new Mounter(LocationBar, 'location-bar-container');

buildLocations = function () {
    var ret;
    ret = [
        {
            label: "Home"
        },
        {
            label: "Setting Editor"
        }
    ];
    return ret;
};

showSettingEditor = function () {
    settingEditorMounter.mount();

    locationBarMounter.props = {
        locations: buildLocations({hasEditor: true})
    };
    locationBarMounter.mount();
};

exports = {
    showSettingEditor: showSettingEditor
};


export default exports;
