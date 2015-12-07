"use strict";

define([
        'jsx!components/setting-editor',
        'jsx!components/popup',
        'jsx!components/location-bar',
        'services/react-component-mounter',
        'services/event'
    ],
    function (SettingEditor,
              PopUp,
              LocationBar,
              Mounter,
              Event) {


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

        return exports;
    });
