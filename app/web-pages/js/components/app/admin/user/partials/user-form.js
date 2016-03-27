import React from 'react';
import { Link } from 'react-router';
import { FieldSet, SubmitButton, Button, ButtonList, Input, Select, Option, Title, Form } from '../../../../partials/form';
import { trimObjValues, slugfy } from '../../../../../utilities';


const onChange = (field, onChange) => {
    return value => onChange({field, value: value.trim()});
};

const preventSubmit = (onSubmit) => {
    return event => {
        event.preventDefault();
        onSubmit();
    };
};

/*
const StateLessUserForm = ({ title, errors, values, onSubmit, onChange, passwordField, submitButtonLabel, locationForBackButton }) => (
    <Form onSubmit={preventSubmit(onSubmit)}>

        <Title>{title}</Title>

        <FieldSet label="Email"
                  error={errors.email}>
            <Input value={values.email}
                   type="email"
                   onChange={onChange("email", onChange)}/>
        </FieldSet>

        {passwordField ? (
            <FieldSet label="Password"
                      error={errors.password}>
                <Input value={values.password}
                       type="text"
                       onChange={onChange("password", onChange)}/>
            </FieldSet>
        ) : null}

        <FieldSet label="Display Name"
                  error={errors.display_name}>
            <Input value={values.display_name}
                   onChange={onChange("display_name", onChange)}/>
        </FieldSet>

        <FieldSet label="Slug"
                  error={errors.slug}>
            <Input value={values.slug}
                   onChange={onChange("slug", onChange)}/>
        </FieldSet>

        <ButtonList>
            <SubmitButton>{submitButtonLabel}</SubmitButton>
            <Link to={locationForBackButton}
                  className="module-button">
                Back
            </Link>
        </ButtonList>

    </Form>
);
*/

class UserForm extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            values: this.props.values,
            errors: this.props.errors
        }
    }

    componentWillReceiveProps (nextProps) {
        this.setState(s => {
            s.values = nextProps.values;
            s.errors = nextProps.errors;
        });
    }

    render() {
        const {
            title,
            onSubmit,
            passwordField,
            submitButtonLabel,
            locationForBackButton
            } = this.props;

        const values = this.state.values;
        const errors = this.state.errors;
        const onChange = this._onChange.bind(this);

        return (
            <Form onSubmit={preventSubmit(onSubmit)}>

                <Title>{title}</Title>

                <FieldSet label="Email"
                          error={errors.email}>
                    <Input value={values.email}
                           type="email"
                           onChange={onChange("email")}/>
                </FieldSet>

                {passwordField ? (
                    <FieldSet label="Password"
                              error={errors.password}>
                        <Input value={values.password}
                               type="text"
                               onChange={onChange("password")}/>
                    </FieldSet>
                ) : null}

                <FieldSet label="Display Name"
                          error={errors.display_name}>
                    <Input value={values.display_name}
                           onChange={onChange("display_name")}/>
                </FieldSet>

                <FieldSet label="Slug"
                          error={errors.slug}>
                    <Input value={values.slug}
                           onChange={onChange("slug")}/>
                </FieldSet>

                <ButtonList>
                    <SubmitButton>{submitButtonLabel}</SubmitButton>
                    <Link to={locationForBackButton}
                          className="module-button">
                        Back
                    </Link>
                </ButtonList>

            </Form>
        )
    }

    _onChange (field) {
        return value => {
            //console.log(field);
            //console.log(value);
        }
    }

}

export default UserForm;

/*
export default class UserForm extends React.Component {

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

                <FieldSet label="Email"
                          error={this.state.errors.email}>
                    <Input value={this.state.values.email}
                           type="email"
                           onChange={value => { this.updateValue('email', value)}}/>
                </FieldSet>

                {this.props.passwordField ? (
                    <FieldSet label="Password"
                              error={this.state.errors.password}>
                        <Input value={this.state.values.password}
                               type="text"
                               onChange={value => { this.updateValue('password', value)}}/>
                    </FieldSet>
                ) : null}

                <FieldSet label="Display Name"
                          error={this.state.errors.display_name}>
                    <Input value={this.state.values.display_name}
                           onChange={this.onDisplayNameChanged.bind(this)}/>
                </FieldSet>

                <FieldSet label="Slug"
                          error={this.state.errors.slug}>
                    <Input value={this.state.values.slug}
                           onChange={this.onSlugChanged.bind(this)}/>
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

    onDisplayNameChanged(value) {
        this.updateValue('display_name', value);

        if (this.state.autoSlugfy) {
            this.updateValue('slug', slugfy(value));
        }
    }

    onSlugChanged(value) {
        this.updateValue('slug', value);

        this.setState(s => {
            s.autoSlugfy = s.values.slug === "";
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
            passwordField: React.PropTypes.bool.isRequired,
            onSubmit: React.PropTypes.func.isRequired,
            submitButtonLabel: React.PropTypes.string.isRequired,
            locationForBackButton: React.PropTypes.string.isRequired
        };
    }
}
    */