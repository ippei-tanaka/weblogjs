import React, { Component } from 'react';
import { FieldSet, SubmitButton, ButtonList, Select, Option, Title, Form, FlushMessage, Input } from '../../../react-components/form';
import actions from '../../actions';
import { connect } from 'react-redux';
import { RESOLVED } from '../../constants/transaction-status';

class SettingEditor extends Component {

    constructor (props)
    {
        super(props);

        this.state = {
            values: {},
            actionId: null
        }
    }

    componentDidMount ()
    {
        this.setState({actionId: Symbol()});
        this.props.loadSetting();
        this.props.loadThemes();
    }

    componentWillUnmount ()
    {
        this.props.finishTransaction({actionId: this.state.actionId});
    }

    render ()
    {
        const {settingStore, transactionStore, themeStore} = this.props;
        const transaction = transactionStore.get(this.state.actionId);
        const themeList = themeStore.toArray().map(obj => obj.name);
        const postsPerPageList = Object.freeze([1, 2, 3, 5, 10, 15]);
        const errors = transaction ? transaction.get('errors') : {};
        const values = Object.assign({}, settingStore, this.state.values);
        const updateSucceeded = transaction && transaction.get('status') === RESOLVED;

        return (
            <Form onSubmit={this._onSubmit.bind(this)}>

                <Title>Setting</Title>

                <FieldSet label="Name"
                          error={errors.name}>
                    <Input value={values.name}
                           onChange={this._onChange.bind(this, "name")}/>
                </FieldSet>

                <FieldSet label="Posts per Page"
                          error={errors.posts_per_page}>
                    <Select value={values.posts_per_page}
                            onChange={this._onChange.bind(this, "posts_per_page")}>
                        {postsPerPageList.map((value, index) =>
                            <Option key={index}
                                    value={value}>
                                {value === 1 ? `${value} post` : `${value} posts`}
                            </Option>
                        )}
                    </Select>
                </FieldSet>

                <FieldSet label="Theme"
                          error={errors.theme}>
                    <Select value={values.theme}
                            onChange={this._onChange.bind(this, "theme")}>
                        {themeList.map((value, index) =>
                            <Option key={index}
                                    value={value}>
                                {value}
                            </Option>
                        )}
                    </Select>
                </FieldSet>

                <ButtonList>
                    <SubmitButton>Update</SubmitButton>
                </ButtonList>

                {updateSucceeded ? (
                    <FlushMessage>Successfully Updated!</FlushMessage>
                ) : null}

            </Form>
        );
    }

    _onChange (field, value)
    {
        this.setState(state =>
        {
            state.values[field] = value;
        });
    }

    _onSubmit (e)
    {
        e.preventDefault();

        this.props.editSetting({
            actionId: this.state.actionId,
            data: this.state.values
        });
    }
}

export default connect(
    state => ({
        settingStore: state.setting,
        transactionStore: state.transaction,
        themeStore: state.theme
    }),
    actions
)(SettingEditor);
