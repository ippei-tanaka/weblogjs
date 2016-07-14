import React, { Component } from 'react';
import { FieldSet, SubmitButton, ButtonList, Select, Option, Title, Form, FlushMessage } from '../../../react-components/form';
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
        this.props.loadBlogs();
        this.props.loadSetting();
    }

    componentWillUnmount ()
    {
        this.props.finishTransaction({actionId: this.state.actionId});
    }

    render ()
    {
        const {settingStore, blogStore, transactionStore} = this.props;
        const blogList = blogStore.toArray();
        const transaction = transactionStore.get(this.state.actionId);
        const errors = transaction ? transaction.get('errors') : {};
        const values = Object.assign({}, settingStore, this.state.values);
        const updateSucceeded = transaction && transaction.get('status') === RESOLVED;

        return (
            <Form onSubmit={this._onSubmit.bind(this)}>

                <Title>Setting</Title>

                <FieldSet label="Front Blog"
                          error={errors.front_blog_id}>
                    <Select value={values.front_blog_id}
                            onChange={this._onChange.bind(this, 'front_blog_id')}>
                        {blogList.map(b => <Option key={b._id} value={b._id}>{b.name}</Option>)}
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
        blogStore: state.blog,
        transactionStore: state.transaction
    }),
    actions
)(SettingEditor);
