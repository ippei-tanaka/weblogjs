import React from 'react';
import ServerFacade from '../../services/server-facade';
import { FieldSet, SubmitButton, Button, ButtonList, Input, Select, Option, FlushMessage, Title, Form } from '../form';
import { trimObjValues, slugfy } from '../../utilities';
import postsPerPageList from './posts-per-page-list';


class BlogEditor extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            errors: {},
            values: {},
            slugPristine: false,
            flushMessage: ""
        };
    }

    componentWillMount() {
       this.retrieveModelData();
    }

    render() {
        return (
            <Form onSubmit={this.onSubmit.bind(this)}>

                <Title>{this.$title}</Title>

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
                            onChange={(v) => this.setState(s => { s.values.posts_per_page = v })}>
                        {postsPerPageList.map((value, index) =>
                        <Option key={index}
                                value={value}>
                            {value === 1 ? `${value} post` : `${value} posts`}
                        </Option>
                            )}
                    </Select>
                </FieldSet>

                <FlushMessage>
                    {this.state.flushMessage}
                </FlushMessage>

                <ButtonList>
                    <SubmitButton>{this.$submitButtonLabel}</SubmitButton>
                    <Button onClick={this.props.onBackButtonClicked}>Back</Button>
                </ButtonList>
            </Form>
        );
    }

    retrieveModelData () {
        var modelPromise = this.$retrieveModelData();

        if (modelPromise) {
            modelPromise
                .then(v => this.setState(s => { s.values = v }));
        }
    }

    onTitleChanged(value) {
        this.setState(state => {
            state.values.title = value;
            if (state.slugPristine) {
                state.values.slug = slugfy(value);
            }
        });
    }

    onSlugChanged(value) {
        this.setState(state => {
            state.values.slug = value;
            state.slugPristine = !value;
        });
    }

    onSubmit(event) {
        event.preventDefault();

        this.$sendModelData(trimObjValues(this.state.values))
            .then(() => {
                var promise = this.$showFlushMessage(this.$successMessage);
                return promise || Promise.resolve();
            })
            .then(this.props.onComplete)
            .catch((data) => this.setState(state => {
                state.errors = data.errors;
                state.flushMessage = "";
            }));
    }

    $showFlushMessage (message) {
        return new Promise((resolve, reject) => this.setState(state => {
            state.errors = {};
            state.flushMessage = message;
        }, resolve));
    }

    $retrieveModelData () {
        return ServerFacade.getBlog(this.props.id);
    }

    $sendModelData (data) {
        return ServerFacade.updateBlog(this.props.id, data);
    }

    get $title () {
        return "Edit the Blog";
    }

    get $successMessage () {
        return "It is successfully updated!";
    }

    get $submitButtonLabel () {
        return "Save";
    }

    static get defaultProps() {
        return {
            id: null,
            onComplete: () => {},
            onBackButtonClicked: () => {}
        }
    };

}


export default BlogEditor;