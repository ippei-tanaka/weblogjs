import React from 'react';
import GlobalEvents from '../services/global-events';
import ServerFacade from '../services/server-facade';
import Confirmation from './confirmation';


var UserDeleter = React.createClass({

    getInitialState: function () {
        return {
            display_name: ""
        };
    },

    getDefaultProps: function () {
        return {
            userId: "",
            onComplete: function () {
            }
        };
    },

    componentWillMount: function () {
        ServerFacade.getUser(this.props.userId).then(function (user) {
            this.setState({
                display_name: user.display_name
            });
        }.bind(this));
    },

    render: function () {
        return (
            <Confirmation
                mode="choose"
                onApproved={this._onDeleteApproved}
                onCanceled={this._onDeleteCanceled}
            >
                Do you want to delete "{this.state.display_name}"?
            </Confirmation>
        );
    },

    _onDeleteApproved: function () {
        this._deleteUser()
            .then(() => this.props.onComplete())
            .catch(data => console.error(data));
    },

    _onDeleteCanceled: function () {
        this.props.onComplete();
    },

    _deleteUser: function () {
        return ServerFacade.deleteUser(this.props.userId)
            .then(function () {
                GlobalEvents.userDeleted.fire();
            });
    }

});

export default UserDeleter;