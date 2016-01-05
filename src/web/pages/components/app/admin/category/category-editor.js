import React from 'react';
import { Link } from 'react-router';
import Page from '../../../abstructs/page';
import ServerFacade from '../../../../services/server-facade';
import { FieldSet, SubmitButton, Button, ButtonList, Input, Select, Option, FlushMessage, Title, Form } from '../../../form';
import { trimObjValues, slugfy } from '../../../../utilities';


class CategoryEditor extends Page {

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
        this.setRetrievedModelData();
    }

    render() {
        this.setPageTitle(this.title);

        return (
            <Form onSubmit={this.onSubmit.bind(this)}>

                <Title>{this.title}</Title>

                <FieldSet label="Name"
                          error={this.state.errors.name}>
                    <Input value={this.state.values.name}
                           onChange={this.onNameChanged.bind(this)}/>
                </FieldSet>

                <FieldSet label="Slug"
                          error={this.state.errors.slug}>
                    <Input value={this.state.values.slug}
                           onChange={this.onSlugChanged.bind(this)}/>
                </FieldSet>

                <FlushMessage>
                    {this.state.flushMessage}
                </FlushMessage>

                <ButtonList>
                    <SubmitButton>{this.submitButtonLabel}</SubmitButton>
                    <Link to="/admin/categories"
                          className="module-button">
                        Back
                    </Link>
                </ButtonList>
            </Form>
        );
    }

    setRetrievedModelData () {
        var modelPromise = this.retrieveModelData();

        if (modelPromise) {
            modelPromise
                .then(v => this.setState(s => { s.values = v }));
        }
    }

    onNameChanged(value) {
        this.setState(state => {
            state.values.name = value;
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

        this.sendModelData(trimObjValues(this.state.values))
            .then(() => {
                var promise = this.showFlushMessage(this.successMessage);
                return promise || Promise.resolve();
            })
            .then(this.props.onComplete)
            .catch((data) => this.setState(state => {
                state.errors = data.errors;
                state.flushMessage = "";
            }));
    }

    showFlushMessage (message) {
        return new Promise((resolve, reject) => this.setState(state => {
            state.errors = {};
            state.flushMessage = message;
        }, resolve));
    }

    retrieveModelData () {
        return ServerFacade.getCategory(this.props.params.id);
    }

    sendModelData (data) {
        return ServerFacade.updateCategory(this.props.params.id, data);
    }

    get title () {
        return "Edit the Category";
    }

    get successMessage () {
        return "It is successfully updated!";
    }

    get submitButtonLabel () {
        return "Save";
    }

    static get propTypes() {
        return {
            params: React.PropTypes.object
        };
    }

}


export default CategoryEditor;
