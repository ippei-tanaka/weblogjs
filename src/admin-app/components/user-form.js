import React from 'react';
import { Link } from 'react-router';
import { FieldSet, SubmitButton, Button, ButtonList, Input, Title, Form } from '../../react-components/form';

export default function UserForm({
    title,
    values,
    errors,
    onChange,
    onSubmit,
    onClickBackButton,
    passwordField,
    submitButtonLabel,
    pathToPasswordForm
    }) {

    const _onChange = field => {
        return value => onChange(field, value);
    };

    const _onSubmit = event => {
        event.preventDefault();
        onSubmit();
    };

    return (
        <Form onSubmit={_onSubmit}>

            <Title>{title}</Title>

            <FieldSet label="Email"
                      error={errors.email}>
                <Input value={values.email}
                       type="email"
                       onChange={_onChange("email")}/>
            </FieldSet>

            {passwordField ? (
                <FieldSet label="Password"
                          error={errors.password}>
                    <Input value={values.password}
                           type="text"
                           onChange={_onChange("password")}/>
                </FieldSet>
            ) : null}

            <FieldSet label="Display Name"
                      error={errors.display_name}>
                <Input value={values.display_name}
                       onChange={_onChange("display_name")}/>
            </FieldSet>

            <FieldSet label="Slug"
                      error={errors.slug}>
                <Input value={values.slug}
                       onChange={_onChange("slug")}/>
            </FieldSet>

            <ButtonList>
                <SubmitButton>{submitButtonLabel}</SubmitButton>
                <Button onClick={onClickBackButton}
                      className="module-button">
                    Back
                </Button>
                {pathToPasswordForm && (
                    <Link className="module-button"
                          to={pathToPasswordForm}>
                        <i className="fa fa-key" /> Change the password
                    </Link>
                )}
            </ButtonList>

        </Form>
    )
}
