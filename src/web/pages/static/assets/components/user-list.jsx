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

                var created = Moment(this.props.user.created).format("YYYY-MM-DD HH:mm Z");
                var updated = Moment(this.props.user.updated).format("YYYY-MM-DD HH:mm Z");

                return (
                    <tr>
                        <th>{this.props.number}</th>
                        <td>{this.props.user.display_name}</td>
                        <td>{this.props.user.email}</td>
                        <td>{created}</td>
                        <td>{updated}</td>
                    </tr>
                );
            }
        });

        return {
            render: function (container) {
                ReactDom.render(<UserList />, container);
            }
        };

    });


/*

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