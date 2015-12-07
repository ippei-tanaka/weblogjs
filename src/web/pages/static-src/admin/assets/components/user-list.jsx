import React from 'react';
import Moment from 'moment';
import ServerFacade from '../services/server-facade';
import GlobalEvents from '../services/global-events';
import Event from '../services/event';


var UserList = React.createClass({

    getInitialState: function () {
        return {
            users: []
        };
    },

    componentDidMount: function () {
        this.events.addButtonClicked.on(this.props.addButtonClicked);
        this.events.editButtonClicked.on(this.props.editButtonClicked);
        this.events.deleteButtonClicked.on(this.props.deleteButtonClicked);

        GlobalEvents.userCreated.on(this._retrieveDataAndUpdateList);
        GlobalEvents.userUpdated.on(this._retrieveDataAndUpdateList);
        GlobalEvents.userDeleted.on(this._retrieveDataAndUpdateList);

        this._retrieveDataAndUpdateList();
    },

    componentWillUnmount: function () {
        GlobalEvents.userCreated.off(this._retrieveDataAndUpdateList);
        GlobalEvents.userUpdated.off(this._retrieveDataAndUpdateList);
        GlobalEvents.userDeleted.off(this._retrieveDataAndUpdateList);
    },

    _retrieveDataAndUpdateList: function () {
        ServerFacade.getUsers()
            .then(function (data) {
                this.setState({
                    users: data
                });
            }.bind(this))

            .catch(function (xhr, status, err) {
                console.error(url, status, err.toString());
            }.bind(this));
    },

    render: function () {
        return (
            <div className="module-data-list">
                <h2 className="m-dtl-title">Users</h2>
                <div>
                    <button className="module-button m-btn-clear m-dtl-add-button"
                            onClick={this.onAddButtonClicked}
                            title="Add"
                    >
                        <i  className="fa fa-plus-square-o m-dtl-add-icon"></i>
                        Add
                    </button>
                </div>
                <table className="m-dtl-table">
                    <thead>
                    <tr>
                        <th>#</th>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Privileges</th>
                        <th>Created</th>
                        <th>Updated</th>
                        <th></th>
                    </tr>
                    </thead>
                    <tbody>
                    {this.state.users.map(function (user, index) {
                        return <UserListItem key={user._id} user={user} events={this.events} number={index+1}/>;
                        }.bind(this))}
                    </tbody>
                </table>
            </div>
        );
    },

    onAddButtonClicked: function (e) {
        e.preventDefault();
        this.events.addButtonClicked.fire();
    },

    events: {
        addButtonClicked: new Event(),
        editButtonClicked: new Event(),
        deleteButtonClicked: new Event()
    }
});

var UserListItem = React.createClass({

    render: function () {

        var privileges = this.props.user.readable_privileges.map(function (p) { return p.toLowerCase(); }).join(', ');
        var created = Moment(this.props.user.created).format("YYYY-MM-DD HH:mm Z");
        var updated = Moment(this.props.user.updated).format("YYYY-MM-DD HH:mm Z");

        return (
            <tr>
                <td data-label="No.">{this.props.number}</td>
                <td data-label="Display Name">{this.props.user.display_name}</td>
                <td data-label="Email">{this.props.user.email}</td>
                <td data-label="Updated">{privileges}</td>
                <td data-label="Created">{created}</td>
                <td data-label="Updated">{updated}</td>
                <td className="m-dtl-no-wrap">
                    <ul className="m-dtl-button-list">
                        <li className="m-dtl-button-list-item">
                            <button className="module-button m-btn-clear" onClick={this.onEditButtonClicked}><i title="Edit" className="fa fa-pencil-square-o m-dtl-edit-icon"></i></button>
                        </li>
                        <li className="m-dtl-button-list-item">
                            <button className="module-button m-btn-clear" onClick={this.onDeleteButtonClicked}><i title="Delete" className="fa fa-trash-o m-dtl-delete-icon"></i></button>
                        </li>
                    </ul>
                </td>
            </tr>
        );
    },

    onDeleteButtonClicked: function (e) {
        e.preventDefault();
        this.props.events.deleteButtonClicked.fire(this.props.user._id);
    },

    onEditButtonClicked: function (e) {
        e.preventDefault();
        this.props.events.editButtonClicked.fire(this.props.user._id);
    }

});

export default UserList;