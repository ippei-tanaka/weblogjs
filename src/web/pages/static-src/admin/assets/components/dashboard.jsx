import React from 'react';
//import ServerFacade from '../services/server-facade';

var Dashboard = React.createClass({

    getInitialState: function () {
        return {
            myName: "test"
        };
    },

    componentWillMount: function () {
        /*
        ServerFacade.getMe().then(function (me) {
            this.setState({
                myName: me.display_name
            });
        }.bind(this));
        */
    },

    render: function () {
        return (
            <div className="module-dashboard">
                <p>Today, {this.state.myName} will feel {Math.random() > 0.5 ? "lucky!" : "unlucky..."}</p>
            </div>
        );
    }
});

export default Dashboard;
