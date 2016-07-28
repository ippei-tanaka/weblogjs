import React from 'react';
import { FieldSet, SubmitButton, Button, ButtonList, Input, Title, Form } from '../../react-components/form';

export default function CategoryForm({
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

    return (
        <Form onSubmit={_onSubmit}>

            <Title>{title}</Title>

            <FieldSet label="Name"
                      error={errors.name}>
                <Input value={values.name}
                       onChange={_onChange("name")}/>
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
