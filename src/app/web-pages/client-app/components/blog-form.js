import React from 'react';
import { FieldSet, SubmitButton, Button, ButtonList, Input, Select, Option, Title, Form } from './form';
import { PostsPerPageList } from '../constants/config';

export default function BlogForm({
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

            <FieldSet label="Posts per Page"
                      error={errors.posts_per_page}>
                <Select value={values.posts_per_page}
                        onChange={_onChange("posts_per_page")}>
                    {PostsPerPageList.map((value, index) =>
                        <Option key={index}
                                value={value}>
                            {value === 1 ? `${value} post` : `${value} posts`}
                        </Option>
                    )}
                </Select>
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