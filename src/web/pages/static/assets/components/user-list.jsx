"use strict";

define([
        'react',
        'react-dom',
        'moment',
        'event-manager',
        'jquery'],
    function (React,
              ReactDom,
              Moment,
              EventManager,
              $) {

        var url = "/api/v1/users";

        var UserList = React.createClass({

            getInitialState: function () {
                return {
                    users: []
                };
            },

            componentDidMount: function () {
                EventManager.on('user-created, user-updated, user-deleted', this.retrieveDataAndUpdateList.bind(this));
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
                        <table className="m-usl-table">
                            <thead>
                            <tr>
                                <th>#</th>
                                <th>Name</th>
                                <th>Email</th>
                                <th></th>
                                <th className="m-usl-hidden-cell">Created</th>
                                <th className="m-usl-hidden-cell">Updated</th>
                            </tr>
                            </thead>
                            <tbody>
                            {this.state.users.map(function (user, index) {
                                return <UserListItem key={user._id} id={user._id} user={user} number={index+1}/>;
                            })}
                            </tbody>
                        </table>
                    </div>
                );
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
                        <td><i className="fa fa-trash-o m-usl-trash-icon" onClick={this.onTrashIconClicked}></i></td>
                        <td className="m-usl-hidden-cell">{created}</td>
                        <td className="m-usl-hidden-cell">{updated}</td>
                    </tr>
                );
            },

            onTrashIconClicked: function (e) {
                e.preventDefault();

                $.ajax({
                    url: url + "/" + this.props.id,
                    dataType: 'json',
                    cache: false,
                    method: 'delete'
                })
                    .then(function () {
                        EventManager.fire('user-deleted');
                    }.bind(this))
                    .fail(function (xhr, status, err) {
                        console.error(url, status, err.toString());
                    }.bind(this));

                return;
            }

        });

        return {
            render: function (container) {
                ReactDom.render(<UserList />, container);
            }
        };

    });

