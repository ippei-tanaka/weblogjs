import React from 'react';
import { Link } from 'react-router';
import { FieldSet, SubmitButton, Button, ButtonList, Input, Select, Option, Title, Form } from './form';
import { trimObjValues, slugfy } from '../utilities';

export default function UserForm(props) {

    const {
        title,
        values,
        errors,
        onChange,
        onSubmit,
        passwordField,
        submitButtonLabel,
        locationForBackButton
        } = props;

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
                <Link to={locationForBackButton}
                      className="module-button">
                    Back
                </Link>
            </ButtonList>

        </Form>
    )
}
