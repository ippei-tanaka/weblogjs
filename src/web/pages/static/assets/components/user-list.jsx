"use strict";

define([
        'react',
        'react-dom',
        'moment',
        'global-events',
        'event',
        'jquery'],
    function (React,
              ReactDom,
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
                GlobalEvents.userCreated.on(this.retrieveDataAndUpdateList.bind(this));
                GlobalEvents.userUpdated.on(this.retrieveDataAndUpdateList.bind(this));
                GlobalEvents.userDeleted.on(this.retrieveDataAndUpdateList.bind(this));
                this.retrieveDataAndUpdateList();
            },

            retrieveDataAndUpdateList: function () {
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
                                return <UserListItem key={user._id} user={user} number={index+1}/>;
                            })}
                            </tbody>
                        </table>

                        <div>
                            <a className="m-usl-add-button" onClick={this.onAddButtonClicked}><i className="fa fa-plus-square-o m-usl-add-icon"></i> Add</a>
                        </div>
                    </div>
                );
            },

            onAddButtonClicked: function (e) {
                e.preventDefault();
                exports.onAddButtonClicked.fire();
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
                        <td className="m-usl-center"><i title="Edit" className="fa fa-pencil-square-o m-usl-edit-icon" onClick={this.onEditButtonClicked}></i></td>
                        <td className="m-usl-center"><i title="Delete" className="fa fa-trash-o m-usl-delete-icon" onClick={this.onDeleteButtonClicked}></i></td>
                        <td className="m-usl-hidden-cell">{created}</td>
                        <td className="m-usl-hidden-cell">{updated}</td>
                    </tr>
                );
            },

            onDeleteButtonClicked: function (e) {
                e.preventDefault();
                exports.onDeleteButtonClicked.fire(this.props.user);

                /*
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
                */
            },

            onEditButtonClicked: function (e) {
                e.preventDefault();
                exports.onEditButtonClicked.fire(this.props.user);
            }

        });


        var exports = {

            onAddButtonClicked: new Event(),
            onEditButtonClicked: new Event(),
            onDeleteButtonClicked: new Event(),

            render: function (container) {
                ReactDom.render(<UserList />, container);
            }
        };

        return exports;
    });

