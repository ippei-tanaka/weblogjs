import React from 'react';
import { Input, ErrorMessage, Label } from './form';

const trimValue = (field, onChange) => {
    return value => onChange({field, value: value.trim()});
};

const preventSubmit = (onSubmit) => {
    return event => {
        event.preventDefault();
        onSubmit();
    };
};

const LoginForm = ({ error, email, password, onSubmit, onChange }) => (
    <form className="module-login-form" method="post" onSubmit={preventSubmit(onSubmit)}>
        <div className="m-lgf-wrapper">
            <div className="module-data-editor">
                <h1 className="m-dte-title">WeblogJS Admin Site</h1>

                <div className="m-dte-field-container">
                    <Label htmlFor="LoginFormEmailField">Email Address</Label>
                    <Input
                        id="LoginFormEmailField"
                        type="email"
                        value={email}
                        onChange={trimValue("email", onChange)}
                    />
                </div>

                <div className="m-dte-field-container">
                    <Label htmlFor="LoginFormPasswordField">Password</Label>
                    <Input
                        id="LoginFormPasswordField"
                        type="password"
                        value={password}
                        onChange={trimValue("password", onChange)}
                    />
                </div>

                { error
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

export default LoginForm;
