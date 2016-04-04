import React from 'react';
import { Link } from 'react-router';
import { FieldSet, SubmitButton, Button, ButtonList, Input, Select, Option, Title, Form } from './form';
import { trimObjValues, slugfy } from '../utilities';

export default function UserForm({
    title,
    values,
    errors,
    onChange,
    onSubmit,
    onClickBackButton,
    submitButtonLabel
    }) {

    const _onChange = field => {
        return value => onChange(field, value);
    };

    const _onSubmit = event => {
        event.preventDefault();
        onSubmit();
    };

    console.log(errors);

    return (
        <Form onSubmit={_onSubmit}>

            <Title>{title}</Title>

            <FieldSet label="Old Password"
                      error={errors.old_password}>
                <Input value={values.old_password}
                       type="text"
                       onChange={_onChange("old_password")}/>
            </FieldSet>

            <FieldSet label="New Password"
                      error={errors.new_password}>
                <Input value={values.new_password}
                       type="text"
                       onChange={_onChange("new_password")}/>
            </FieldSet>

            <FieldSet label="Confirm the New Password"
                      error={errors.new_password_confirmed}>
                <Input value={values.new_password_confirmed}
                       type="text"
                       onChange={_onChange("new_password_confirmed")}/>
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
