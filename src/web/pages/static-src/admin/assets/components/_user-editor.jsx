import React from 'react';
import GlobalEvents from '../services/global-events';
import ServerFacade from '../services/server-facade';
import InputField from './form-field/field/input';
import Checkbox from './form-field/field/checkbox';
import CheckboxList from './form-field/field/checkbox-list';
import Label from './form-field/label';
import ErrorMessage from './form-field/error-message';


class UserEditor extends React.Component {

    /*
    getInitialState: function () {
        return {
            data: {
                email: "",
                password: "",
                display_name: "",
                privileges: []
            },

            errors: {
                email: null,
                password: null,
                display_name: null,
                privileges: null
            },

            privilege_list: []
        };
    },

    getDefaultProps: function () {
        return {
            mode: "", // 'add' or 'edit'
            userId: "",
            onComplete: function () {
            }
        };
    },

    componentWillMount: function () {
        if (this.props.mode === "edit") {
            ServerFacade.getUser(this.props.userId).then(function (user) {
                this._setUserState(this.getInitialState().user, user);
            }.bind(this));
        }

        ServerFacade.getPrivileges().then(function (privileges) {
            this.setState({
                privilege_list: Object.keys(privileges).map(function (key) {
                    return {
                        value: privileges[key],
                        label: key
                    }
                })
            });
        }.bind(this));
    },

    render: function () {

        var title = this._chooseByMode({add: "Create a New User", edit: "Edit the User"});

        var buttonLabel = this._chooseByMode({add: "Create", edit: "Edit"});

        return (
            <form className="module-data-editor" onSubmit={this._onSubmit}>
                <h2 className="m-dte-title">{title}</h2>

                <div className="m-dte-field-container">
                    <Label htmlFor="UserEditorEmailField">
                        Email Address
                    </Label>
                    <InputField
                        id="UserEditorEmailField"
                        type="email"
                        value={this.state.email}
                        onChange={value => this.setState({email: value})}
                    />
                    <ErrorMessage error={this.state.errors.email}/>
                </div>

                { this.props.mode === 'add' ?
                <div className="m-dte-field-container">
                    <Label htmlFor="UserEditorPasswordField">
                        Password
                    </Label>
                    <InputField
                        id="UserEditorPasswordField"
                        type="password"
                        value={this.state.password}
                        onChange={value => this.setState({password: value})}
                    />
                    <ErrorMessage error={this.state.errors.password}/>
                </div>
                    : null }

                <div className="m-dte-field-container">
                    <Label htmlFor="UserEditorEmailField">
                        Display Name
                    </Label>
                    <InputField
                        id="UserEditorEmailField"
                        type="text"
                        value={this.state.display_name}
                        onChange={value => this.setState({display_name: value})}
                    />
                    <ErrorMessage error={this.state.errors.display_name}/>
                </div>

                <div className="m-dte-field-container">
                    <CheckboxList onChange={value => console.log(value) }>
                        {[<Checkbox
                            key="q"
                            name="eee"
                            value={true}
                        />,
                        <Checkbox
                            key="de"
                            name="kokj"
                            value={true}
                        />]}
                    </CheckboxList>
                    <ErrorMessage error={this.state.errors.privileges}/>
                </div>

                <div className="m-dte-field-container">
                    <button className="module-button"
                            type="submit">{buttonLabel}</button>
                </div>
            </form>
        );
    },

    _onSubmit: function (e) {
        e.preventDefault();

        var ajaxFunc = this._chooseByMode({
            add: this._createUser,
            edit: this._updateUser
        });

        ajaxFunc()
            .then(function () {
                this.setState(this.getInitialState());
                this.props.onComplete();
            }.bind(this))
            .catch(function (data) {
                this.setState({
                    errors: data.errors
                });
            }.bind(this));
    },

    _createUser: function () {

        var data = {
            email: this.state.user.email.trim(),
            password: this.state.user.password.trim(),
            display_name: this.state.user.display_name.trim()
        };

        return ServerFacade.createUser(data)
            .then(function () {
                GlobalEvents.userCreated.fire();
            });
    },

    _updateUser: function () {

        var data = {
            display_name: this.state.user.display_name.trim(),
            privileges: this.state.user.privileges
        };

        return ServerFacade.updateUser(this.props.userId, data)
            .then(function () {
                GlobalEvents.userUpdated.fire();
            });
    }
    */

    render () {
        return <div>123</div>
    }
}

export default UserEditor;