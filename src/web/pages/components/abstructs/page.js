import React from "react";


export default class Page extends React.Component {

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
