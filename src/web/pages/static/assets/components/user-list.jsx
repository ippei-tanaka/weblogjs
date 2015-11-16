"use strict";

define([
        'react',
        'moment',
        'global-events',
        'event',
        'jquery'],
    function (React,
              Moment,
              GlobalEvents,
              Event,
              $) {

        var url = "/api/v1/users";

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
                $.ajax({
                    url: url,
                    dataType: 'json',
                    cache: false
                })
                    .then(function (data) {
                        this.setState({
                            users: data.items
                        });
                    }.bind(this))

                    .fail(function (xhr, status, err) {
                        console.error(url, status, err.toString());
                    }.bind(this));
            },

            render: function () {
                return (
                    <div className="module-user-list">
                        <h2 className="m-usl-title">User List</h2>

                        <table className="m-usl-table">
                            <thead>
                            <tr>
                                <th>#</th>
                                <th>Name</th>
                                <th>Email</th>
                                <th></th>
                                <th></th>
                                <th className="m-usl-hidden-cell">Created</th>
                                <th className="m-usl-hidden-cell">Updated</th>
                            </tr>
                            </thead>
                            <tbody>
                            {this.state.users.map(function (user, index) {
                                return <UserListItem key={user._id} user={user} events={this.events} number={index+1}/>;
                            }.bind(this))}
                            </tbody>
                        </table>

                        <div>
                            <button className="module-button m-btn-clear m-usl-add-button" onClick={this.onAddButtonClicked}><i className="fa fa-plus-square-o m-usl-add-icon"></i> Add</button>
                        </div>
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

                var created = Moment(this.props.user.created).format("YYYY-MM-DD HH:mm Z");
                var updated = Moment(this.props.user.updated).format("YYYY-MM-DD HH:mm Z");

                return (
                    <tr>
                        <th>{this.props.number}</th>
                        <td>{this.props.user.display_name}</td>
                        <td>{this.props.user.email}</td>
                        <td className="m-usl-center"><button className="module-button m-btn-clear" onClick={this.onEditButtonClicked}><i title="Edit" className="fa fa-pencil-square-o m-usl-edit-icon"></i></button></td>
                        <td className="m-usl-center"><button className="module-button m-btn-clear" onClick={this.onDeleteButtonClicked}><i title="Delete" className="fa fa-trash-o m-usl-delete-icon"></i></button></td>
                        <td className="m-usl-hidden-cell">{created}</td>
                        <td className="m-usl-hidden-cell">{updated}</td>
                    </tr>
                );
            },

            onDeleteButtonClicked: function (e) {
                e.preventDefault();
                this.props.events.deleteButtonClicked.fire(this.props.user);

                // TODO: Move the code for deleting a user to another component.
                //---
                var message = 'Do you want to delete "' + this.props.user.display_name + '"?';

                if (confirm(message)) {
                    $.ajax({
                        url: url + "/" + this.props.user._id,
                        dataType: 'json',
                        cache: false,
                        method: 'delete'
                    })
                        .then(function () {
                            GlobalEvents.userDeleted.fire();
                        }.bind(this))

                        .fail(function (xhr, status, err) {
                            console.error(url, status, err.toString());
                        }.bind(this));
                }
                //---
            },

            onEditButtonClicked: function (e) {
                e.preventDefault();
                this.props.events.editButtonClicked.fire(this.props.user);
            }

        });

        return UserList;
    });

