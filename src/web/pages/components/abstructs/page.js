import React from "react";
import hat from 'hat';

var rack = hat.rack();

export default class Page extends React.Component {

    generateToken() {
        return rack();
    }

    setPageTitle (title) {
        if (typeof document !== "undefined") {
            document.title = title;
        }
    }

    static get contextTypes () {
        return {
            history: React.PropTypes.object,
            location: React.PropTypes.object
        };
    };

};
