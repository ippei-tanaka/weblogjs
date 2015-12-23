import React from "react";

export default class App extends React.Component {

    render () {
        return (
            <div>
                App
                <br />
                {this.props.children}
            </div>
        )
    }

};