define([
        'react',
        'react-dom'],
    function (React,
              ReactDom) {

        var UserManager = React.createClass({
            render: function () {
                return (
                    <div>Friends</div>
                );
            }
        });

        return {
            render: function (container) {
                ReactDom.render(<UserManager />, container);
            }
        };

    });

/*


var UserList = React.createClass({

    getInitialState: function () {
        return {users: []};
    },

    componentDidMount: function () {
        Event.on('user-created', this.retrieveDataAndUpdateList.bind(this));
        this.retrieveDataAndUpdateList();
    },

    retrieveDataAndUpdateList: () => {
        $.ajax({
            url: this.props.url,
            dataType: 'json',
            cache: false
        })
            .then(function (data) {
                this.setState({users: data.items});
            }.bind(this))
            .fail(function (xhr, status, err) {
                console.error(this.props.url, status, err.toString());
            }.bind(this));
    },

    render: function () {
        return (
            <div className="table-responsive">
                <table className="table">
                    <thead>
                    <tr>
                        <th>#</th>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Created</th>
                        <th>Updated</th>
                    </tr>
                    </thead>
                    <tbody>
                    {this.state.users.map(function (user, index) {
                        return <UserListItem key={user._id} user={user} number={index+1}/>;
                    })}
                    </tbody>
                </table>
            </div>
        );
    }
});


var UserListItem = React.createClass({

    render: function () {
        return (
            <tr>
                <th>{this.props.number}</th>
                <td>{this.props.user.display_name}</td>
                <td>{this.props.user.email}</td>
                <td>{this.props.user.created}</td>
                <td>{this.props.user.updated}</td>
            </tr>
        );
    }
});


var UserCreationForm = React.createClass({

    onSubmit: function (e) {
        e.preventDefault();

        var email = this.refs.email.value.trim();
        var password = this.refs.password.value.trim();
        var display_name = this.refs.display_name.value.trim();

        $.ajax({
            url: this.props.url,
            dataType: 'json',
            cache: false,
            method: 'post',
            data: {
                email,
                password,
                display_name
            }
        })
            .then(function (data) {
                console.log(data);
                //this.setState({users: data.items});
            }.bind(this))
            .fail(function (xhr, status, err) {
                console.log(err);
                //console.error(this.props.url, status, err.toString());
            }.bind(this));

        return;
    },

    render: function () {
        return (
            <div>
                <form className="form-inline" onSubmit={this.onSubmit}>
                    <div className="form-group">
                        <label className="sr-only" htmlFor="UserManagerEmailInput">Email address</label>
                        <input type="email" className="form-control" id="UserManagerEmailInput" placeholder="Email"
                               ref="email"/>
                    </div>
                    <div className="form-group">
                        <label className="sr-only" htmlFor="UserManagerPasswordInput">Password</label>
                        <input type="password" className="form-control" id="UserManagerPasswordInput"
                               placeholder="Password" ref="password"/>
                    </div>
                    <div className="form-group">
                        <label className="sr-only" htmlFor="UserManagerDisplayNameInput">Display Name</label>
                        <input type="text" className="form-control" id="UserManagerDisplayNameInput"
                               placeholder="Display Name" ref="display_name"/>
                    </div>
                    <button type="submit" className="btn btn-default">Create</button>
                </form>
            </div>
        );
    }
});


var UserManager = React.createClass({

    render: function () {
        return (
            <div>
                <UserList url={this.props.url}/>
                <UserCreationForm url={this.props.url}/>
            </div>
        );
    }
});


ReactDOM.render(
    <UserManager url="/api/v1/users"/>,
    document.querySelector('[react="user-manager"]')
);
*/