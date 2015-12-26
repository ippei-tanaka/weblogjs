import React from "react";


export default class Page extends React.Component {

    componentDidMount () {
        if (typeof document !== "undefined") {
            document.title = this.pageTitle;
        }
    }

    static get contextTypes () {
        return {
            history: React.PropTypes.object,
            location: React.PropTypes.object
        };
    };

};
