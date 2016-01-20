import React from 'react';
import { Link } from 'react-router';
import { FieldSet, SubmitButton, Button, ButtonList, Input, Select, Option, Title, Form } from '../../../../partials/form';
import { trimObjValues, slugfy } from '../../../../../utilities';
import PostsPerPageList from './posts-per-page-list';


export default class BlogForm extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            errors: {},
            values: {},
            dirty: {},
            autoSlugfy: props.autoSlugfy
        };
    }

    componentWillReceiveProps(props) {
        this.setState(state => {
            state.values = Object.assign({}, props.values, state.values);
            state.errors = Object.assign({}, props.errors);
        });
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

                <FieldSet label="Posts per Page"
                          error={this.state.errors.posts_per_page}>
                    <Select value={this.state.values.posts_per_page}
                            onChange={value => { this.updateValue('posts_per_page', value)}}>
                        {PostsPerPageList.map((value, index) =>
                            <Option key={index}
                                    value={value}>
                                {value === 1 ? `${value} post` : `${value} posts`}
                            </Option>
                        )}
                    </Select>
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
        this.props.onSubmit(this.getUpdatedData());
    }

    updateValue(fieldName, value) {
        this.setState(s => {
            s.values[fieldName] = value;
            s.dirty[fieldName] = true;
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