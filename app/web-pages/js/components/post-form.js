import React from 'react';
import { Link } from 'react-router';
import { FieldSet, SubmitButton, Button, ButtonList, Input, Select, Option, Checkbox, Textarea, Datetime, TagList, Title, Form } from '../../../../partials/form';
import { trimObjValues, slugfy } from '../../../../../utilities';
import UserStore from '../../../../../stores/user-store';
import BlogStore from '../../../../../stores/blog-store';
import CategoryStore from '../../../../../stores/category-store';

export default class PostForm extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            errors: props.errors,
            values: props.values,
            dirty: {},
            userList: [],
            categoryList: [],
            blogList: [],
            autoSlugfy: props.autoSlugfy
        };

        this.callback = this.updateLists.bind(this);
    }

    componentDidMount() {
        this.updateLists();
        UserStore.addChangeListener(this.callback);
        CategoryStore.addChangeListener(this.callback);
        BlogStore.addChangeListener(this.callback);
    }

    componentWillUnmount() {
        UserStore.removeChangeListener(this.callback);
        CategoryStore.removeChangeListener(this.callback);
        BlogStore.removeChangeListener(this.callback);
    }

    componentWillReceiveProps(props) {
        this.updateModelByProps(props);
    }

    render() {
        return (
            <Form onSubmit={this.onSubmit.bind(this)}>

                <Title>{this.props.title}</Title>

                <FieldSet label="Title"
                          error={this.state.errors.title}>
                    <Input value={this.state.values.title}
                           onChange={this.onTitleChanged.bind(this)}/>
                </FieldSet>

                <FieldSet label="Slug"
                          error={this.state.errors.slug}>
                    <Input value={this.state.values.slug}
                           onChange={this.onSlugChanged.bind(this)}/>
                </FieldSet>

                <FieldSet label="Content"
                          error={this.state.errors.content}>
                    <Textarea value={this.state.value}
                              onChange={value => { this.updateValue('content', value)}}/>
                </FieldSet>

                <FieldSet label="Category"
                          error={this.state.errors.category}>
                    <Select value={this.state.values.category}
                            onChange={value => { this.updateValue('category', value)}}>
                        {this.state.categoryList.map(c => <Option key={c._id} value={c._id}>{c.name}</Option>)}
                    </Select>
                </FieldSet>

                <FieldSet label="Author"
                          error={this.state.errors.author}>
                    <Select value={this.state.values.author}
                            onChange={value => { this.updateValue('author', value || null)}}>
                        {this.state.userList.map(u => <Option key={u._id} value={u._id}>{u.display_name}</Option>)}
                    </Select>
                </FieldSet>

                <FieldSet label="Blog"
                          error={this.state.errors.blog}>
                    <Select value={this.state.values.blog}
                            onChange={value => { this.updateValue('blog', value || null)}}>
                        {this.state.blogList.map(b => <Option key={b._id} value={b._id}>{b.title}</Option>)}
                    </Select>
                </FieldSet>

                <FieldSet label="Tags"
                          error={this.state.errors.tags}>
                    <TagList value={this.state.values.tags}
                             onChange={value => { this.updateValue('tags', value)}}/>
                </FieldSet>

                <FieldSet label="Published Date"
                          error={this.state.errors.publish_date}>
                    <Datetime value={this.state.values.publish_date}
                              onChange={value => { this.updateValue('publish_date', value)}}/>
                </FieldSet>

                <FieldSet label="Is this post a draft?"
                          error={this.state.errors.is_draft}>
                    <Checkbox value={this.state.values.is_draft}
                              onChange={event => { this.updateValue('is_draft', event.target.checked) }}/>
                </FieldSet>

                <ButtonList>
                    <SubmitButton>{this.props.submitButtonLabel}</SubmitButton>
                    <Link to={this.props.locationForBackButton}
                          className="module-button">
                        Back
                    </Link>
                </ButtonList>

            </Form>
        );
    }

    onTitleChanged(value) {
        this.updateValue('title', value);

        if (this.state.autoSlugfy) {
            this.updateValue('slug', slugfy(value));
        }
    }

    onSlugChanged(value) {
        this.updateValue('slug', value);
        this.setState(s => {
            s.autoSlugfy = false
        });
    }

    onSubmit(event) {
        event.preventDefault();
        this.props.onSubmit({
            full: this.state.values,
            updated: this.getUpdatedData()
        });
    }

    updateValue(fieldName, value) {
        this.setState(s => {
            s.values[fieldName] = value;
            s.dirty[fieldName] = true;
        });
    }

    updateModelByProps(props) {
        this.setState(state => {
            state.values = Object.assign({}, props.values, state.values);
            state.errors = Object.assign({}, props.errors);
        });
    }

    updateLists() {
        this.setState(state => {
            state.userList = UserStore.getAll();
            state.categoryList = CategoryStore.getAll();
            state.blogList = BlogStore.getAll();
        });
    }

    getUpdatedData() {
        var updatedFieldNames = Object.keys(this.state.dirty)
            .filter(fieldName => {
                return this.state.dirty[fieldName];
            });

        var updatedFields = {};

        updatedFieldNames.forEach(name => {
            updatedFields[name] = this.state.values[name];
        });

        return updatedFields;
    }

    static get propTypes() {
        return {
            title: React.PropTypes.string.isRequired,
            errors: React.PropTypes.object.isRequired,
            values: React.PropTypes.object.isRequired,
            autoSlugfy: React.PropTypes.bool.isRequired,
            onSubmit: React.PropTypes.func.isRequired,
            submitButtonLabel: React.PropTypes.string.isRequired,
            locationForBackButton: React.PropTypes.string.isRequired
        };
    }
}