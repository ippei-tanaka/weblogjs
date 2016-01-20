import React from 'react';
import { Input, ErrorMessage, Label } from '../../../partials/form';


export default class LoginForm extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            error: false,
            email: "",
            password: ""
        };
    }

    componentWillReceiveProps (newProps) {
        this.setState(s => {
            s.error = newProps.error
        });
    }

    onSubmit(e) {
        e.preventDefault();

        var email = this.state.email.trim();
        var password = this.state.password.trim();

        this.props.onSubmit({email, password});
    }

    render() {
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

    static get propTypes() {
        return {
            onSubmit: React.PropTypes.func.isRequired,
            error: React.PropTypes.bool
        };
    }

}