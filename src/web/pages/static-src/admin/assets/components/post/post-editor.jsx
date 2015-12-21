import React from 'react';
import ServerFacade from '../../services/server-facade';
import {
    FieldSet, FlushMessage, Title, Form,
    SubmitButton, Button, ButtonList,
    Input, Select, Option, Textarea, TagList, Datetime
} from '../form';
import { trimObjValues, slugfy } from '../../utilities';
import PopUp from '../popup';
import PostPreview from './post-preview';

class PostEditor extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            errors: {},
            values: {},
            slugPristine: false,
            flushMessage: "",
            categoryList: [],
            authorList: [],
            blogList: [],
            preview: null
        };
    }

    componentWillMount() {
        this.retrieveModelData();

        ServerFacade.getCategories()
            .then(categories => this.setState(s => { s.categoryList = categories }));

        ServerFacade.getUsers()
            .then(users => this.setState(s => { s.authorList = users }));

        ServerFacade.getBlogs()
            .then(blogs => this.setState(s => { s.blogList = blogs }));

        ServerFacade.getMe()
            .then(me => this.setState(s => { s.values.author = me._id }));

        ServerFacade.getSetting()
            .then(setting => this.setState(s => { s.values.blog = setting.front }));
    }

    render() {
        return this.form;//!this.state.preview ? this.form : this.preview;
    }

    get form() {
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

                <FieldSet label="Content"
                          error={this.state.errors.content}>
                    <Textarea value={this.state.values.content}
                           onChange={v => this.setState(s => { s.values.content = v })}/>
                </FieldSet>

                <FieldSet label="Category"
                          error={this.state.errors.category}>
                    <Select value={this.state.values.category}
                            onChange={v => this.setState(s => { s.values.category = v || null })}>
                        {this.state.categoryList.map(c => <Option key={c._id} value={c._id}>{c.name}</Option>)}
                    </Select>
                </FieldSet>

                <FieldSet label="Author"
                          error={this.state.errors.author}>
                    <Select value={this.state.values.author}
                            onChange={v => this.setState(s => { s.values.author = v || null })}>
                        {this.state.authorList.map(u => <Option key={u._id} value={u._id}>{u.display_name}</Option>)}
                    </Select>
                </FieldSet>

                <FieldSet label="Blog"
                          error={this.state.errors.blog}>
                    <Select value={this.state.values.blog}
                            onChange={v => this.setState(s => { s.values.blog = v || null })}>
                        {this.state.blogList.map(b => <Option key={b._id} value={b._id}>{b.title}</Option>)}
                    </Select>
                </FieldSet>

                <FieldSet label="Tags"
                          error={this.state.errors.tags}>
                    <TagList value={this.state.values.tags}
                             onChange={v => this.setState(s => { s.values.tags = v })}/>
                </FieldSet>

                <FieldSet label="Published Date"
                          error={this.state.errors.publish_date}>
                    <Datetime value={this.state.values.publish_date}
                              onChange={v => this.setState(s => { s.values.publish_date = v })}/>
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

    get preview() {
        return <PostPreview slug={this.state.preview.slug} />
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
            .then((post) => {
                //console.log(d);
                //var promise = this.$showFlushMessage(this.$successMessage);
                //return promise || Promise.resolve();
                //this.setState(s => { s.preview = post });
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
        return ServerFacade.getPost(this.props.id);
    }

    $sendModelData (data) {
        return ServerFacade.updatePost(this.props.id, data);
    }

    get $title () {
        return "Edit the Blog";
    }

    get $successMessage () {
        return "It is successfully updated!";
    }

    get $submitButtonLabel () {
        return "Preview";
    }

    static get defaultProps() {
        return {
            id: null,
            onComplete: () => {},
            onBackButtonClicked: () => {}
        }
    };

}


export default PostEditor;