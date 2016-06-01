import React from 'react';
import { FieldSet, SubmitButton, Button, ButtonList, Input, Select, Option, Title, Form } from './form';

export default function UserForm({
    title,
    values,
    errors,
    onChange,
    onSubmit,
    onClickBackButton,
    passwordField,
    submitButtonLabel
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
            </ButtonList>

        </Form>
    )
}
