import React from 'react';
import { FieldSet, SubmitButton, Button, ButtonList, Input, Select, Option, Checkbox, Textarea, Datetime, TagList, Title, Form } from './form';
import PublicPost from './public-post';
import AceEditor from 'react-ace';
import 'brace/mode/html';
import 'brace/theme/chrome';

export default function PostForm({
    title,
    values,
    errors,
    categoryList,
    authorList,
    blogList,
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

            <FieldSet label="Title"
                      error={errors.title}>
                <Input value={values.title}
                       onChange={_onChange("title")}/>
            </FieldSet>

            <FieldSet label="Slug"
                      error={errors.slug}>
                <Input value={values.slug}
                       onChange={_onChange("slug")}/>
            </FieldSet>

            <FieldSet label="Content"
                      error={errors.content}>
                    <AceEditor value={values.content}
                               mode="html"
                               theme="chrome"
                               width="100%"
                               height="300px"
                               fontSize={14}
                               onChange={_onChange("content")}/>
            </FieldSet>

            <div className="m-dte-preview">
                <PublicPost post={values}/>
            </div>

            <FieldSet label="Category"
                      error={errors.category_id}>
                <Select value={values.category_id}
                        onChange={_onChange("category_id")}>
                    {categoryList.map(c => <Option key={c._id} value={c._id}>{c.name}</Option>)}
                </Select>
            </FieldSet>

            <FieldSet label="Author"
                      error={errors.author_id}>
                <Select value={values.author_id}
                        onChange={_onChange("author_id")}>
                    {authorList.map(u => <Option key={u._id} value={u._id}>{u.display_name}</Option>)}
                </Select>
            </FieldSet>

            <FieldSet label="Blog"
                      error={errors.blog_id}>
                <Select value={values.blog_id}
                        onChange={_onChange("blog_id")}>
                    {blogList.map(b => <Option key={b._id} value={b._id}>{b.name}</Option>)}
                </Select>
            </FieldSet>

            <FieldSet label="Tags"
                      error={errors.tags}>
                <TagList value={values.tags}
                         onChange={_onChange("tags")}/>
            </FieldSet>

            <FieldSet label="Published Date"
                      error={errors.published_date}>
                <Datetime value={new Date(values.published_date)}
                          onChange={_onChange("published_date")}/>
            </FieldSet>

            <FieldSet label="Is this post a draft?"
                      error={errors.is_draft}>
                <Checkbox value={values.is_draft}
                          onChange={event => { onChange('is_draft', event.target.checked) }}/>
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