import React, {Component} from 'react';
import classnames from 'classnames';

import {
    FieldSet,
    SubmitButton,
    Button,
    ButtonList,
    Input,
    Select,
    Option,
    Checkbox,
    Textarea,
    Datetime,
    TagList,
    Title,
    Form
} from '../../react-components/form';

import PublicPost from '../../react-components/public-post';

class PostForm extends Component {

    constructor (props)
    {
        super(props);

        this.state = {
            contentEditorFullScreen: false
        }
    }

    render ()
    {
        const {
            title,
            values,
            errors,
            categoryList,
            categoryMap,
            authorList,
            authorMap,
            onClickBackButton,
            submitButtonLabel,
            root
        } = this.props;

        const {
            contentEditorFullScreen
        } = this.state;

        const onChange = this.onChange.bind(this);
        const onSubmit = this.onSubmit.bind(this);
        const onClickContentEditorFullScreenButton = (e) =>
        {
            e.preventDefault();
            this.setState({
                contentEditorFullScreen: !contentEditorFullScreen
            })
        };

        return (
            <Form onSubmit={onSubmit}>

                <Title>{title}</Title>

                <FieldSet label="Title"
                          error={errors.title}>
                    <Input value={values.title}
                           onChange={onChange("title")}/>
                </FieldSet>

                <FieldSet label="Slug"
                          error={errors.slug}>
                    <Input value={values.slug}
                           onChange={onChange("slug")}/>
                </FieldSet>


                <FieldSet label="Content"
                          error={errors.content}>
                    <div
                        className={classnames("module-post-content-editor", {"m-pce-full-screen": contentEditorFullScreen})}>
                        <div className="m-pce-editor">
                        <Textarea value={values.content}
                                  className="m-pce-textarea"
                                  onChange={onChange("content")}/>
                            <div className="m-pce-preview-frame">
                                <div className="module-post-preview">
                                    <div className="m-pce-preview-container">
                                        <PublicPost root={root}
                                                    _id={values._id}
                                                    title={values.title}
                                                    slug={values.slug}
                                                    content={values.content_edited}
                                                    category_id={values.category_id}
                                                    author_id={values.author_id}
                                                    published_date={values.published_date}
                                                    tags={values.tags}
                                                    categories={categoryMap}
                                                    authors={authorMap}/>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <menu className="m-pce-menu">
                            <li>
                                <button className="module-button m-btn-clear"
                                        onClick={onClickContentEditorFullScreenButton}>
                                    <i className="fa fa-arrows-alt" aria-hidden="true"/>
                                </button>
                            </li>
                        </menu>
                    </div>
                </FieldSet>


                <FieldSet label="Category"
                          error={errors.category_id}>
                    <Select value={values.category_id}
                            onChange={onChange("category_id")}>
                        {categoryList.map(c => <Option key={c._id} value={c._id}>{c.name}</Option>)}
                    </Select>
                </FieldSet>

                <FieldSet label="Author"
                          error={errors.author_id}>
                    <Select value={values.author_id}
                            onChange={onChange("author_id")}>
                        {authorList.map(u => <Option key={u._id} value={u._id}>{u.display_name}</Option>)}
                    </Select>
                </FieldSet>

                <FieldSet label="Tags"
                          error={errors.tags}>
                    <TagList value={values.tags}
                             onChange={onChange("tags")}/>
                </FieldSet>

                <FieldSet label="Published Date"
                          error={errors.published_date}>
                    <Datetime value={new Date(values.published_date)}
                              onChange={onChange("published_date")}/>
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

    onChange (field)
    {
        return value => this.props.onChange(field, value);
    }

    onSubmit (event)
    {
        event.preventDefault();
        this.props.onSubmit();
    };
}

export default PostForm;

/*
export default function PostForm ({
    title,
    values,
    errors,
    categoryList,
    categoryMap,
    authorList,
    authorMap,
    onChange,
    onSubmit,
    onClickBackButton,
    submitButtonLabel,
    root
})
{
    const _onChange = field =>
    {
        return value => onChange(field, value);
    };

    const _onSubmit = event =>
    {
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
                <div
                    className={classnames("module-post-content-editor", {"m-pce-full-screen": contentEditorFullScreen})}>
                    <div className="m-pce-editor">
                        <Textarea value={values.content}
                                  className="m-pce-textarea"
                                  onChange={_onChange("content")}/>
                        <div className="m-pce-preview-frame">
                            <div className="module-post-preview">
                                <div className="m-pce-preview-container">
                                    <PublicPost root={root}
                                                _id={values._id}
                                                title={values.title}
                                                slug={values.slug}
                                                content={values.content_edited}
                                                category_id={values.category_id}
                                                author_id={values.author_id}
                                                published_date={values.published_date}
                                                tags={values.tags}
                                                categories={categoryMap}
                                                authors={authorMap}/>
                                </div>
                            </div>
                        </div>
                    </div>
                    <menu className="m-pce-menu">
                        <li>
                            <button className="module-button m-btn-clear"
                                    onClick={(e) =>
                                    {
                                        e.preventDefault();
                                        contentEditorFullScreen = !contentEditorFullScreen;
                                    }}>
                                <i className="fa fa-arrows-alt" aria-hidden="true"/>
                            </button>
                        </li>
                    </menu>
                </div>
            </FieldSet>


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
*/