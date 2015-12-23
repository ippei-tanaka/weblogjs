import React from 'react';
import ServerFacade from '../../../services/server-facade';
import { Input, ErrorMessage, Label } from '../../form';

var successUrl = "/admin/";


export default class LoginForm extends React.Component {

    constructor (props) {
        super(props);

        this.state = {
            error: false,
            email: "",
            password: ""
        };

    }

    onSubmit (e) {
        e.preventDefault();

        var email = this.state.email.trim();
        var password = this.state.password.trim();

        ServerFacade.login(email, password)
            .then(() => {
                this.context.history.replace(successUrl);
            })
            .catch(function () {
                this.setState({
                    error: true
                });
            }.bind(this));
    }

    render () {
        return (
            <form className="module-login-form" method="post" onSubmit={this.onSubmit.bind(this)}>
                <div className="m-lgf-wrapper">
                    <div className="module-data-editor">
                        <h1 className="m-dte-title">WeblogJS Admin Site</h1>

                        <div className="m-dte-field-container">
                            <Label htmlFor="LoginFormEmailField">Email Address</Label>
                            <Input
                                id="LoginFormEmailField"
                                type="email"
                                value={this.state.email}
                                onChange={value => this.setState({ email: value })}
                            />
                        </div>

                        <div className="m-dte-field-container">
                            <Label htmlFor="LoginFormPasswordField">Password</Label>
                            <Input
                                id="LoginFormPasswordField"
                                type="password"
                                value={this.state.password}
                                onChange={value => this.setState({ password: value })}
                            />
                        </div>

                        { this.state.error
                            ? (
                            <div className="m-dte-field-container">
                                <span className="m-lgf-error">The email or password is incorrect.</span>
                            </div>)
                            : null }

                        <div className="m-dte-field-container">
                            <button className="module-button m-btn-plain" type="submit">Sign in</button>
                        </div>
                    </div>
                </div>
            </form>
        );
    }

    static get contextTypes () {
        return {
            history: React.PropTypes.object,
            location: React.PropTypes.object
        };
    };
}