import React from 'react';
import { Link } from 'react-router';
import { FieldSet, SubmitButton, ButtonList, Input, Select, Option, Title, Form } from '../../../form';
import Page from '../../../abstructs/page';
import ViewActionCreator from '../../../../action-creators/view-action-creator';
import SettingStore from '../../../../stores/setting-store';
import BlogStore from '../../../../stores/blog-store';
import hat from 'hat';


var rack = hat.rack();


class SettingEditor extends Page {

    constructor(props) {
        super(props);

        this.state = {
            errors: {},
            values: {},
            blogList: []
        };

        this.token = rack();

        this.settingStoreCallback = this.onSettingStoreChanged.bind(this);
        this.blogStoreCallback = this.setLists.bind(this);
    }

    componentDidMount() {
        this.setCurrentValues();
        this.setLists();
        SettingStore.addChangeListener(this.settingStoreCallback);
        BlogStore.addChangeListener(this.blogStoreCallback);
    }

    componentWillUnmount() {
        SettingStore.removeChangeListener(this.settingStoreCallback);
        BlogStore.removeChangeListener(this.blogStoreCallback);
    }

    render() {
        this.setPageTitle(this.title);

        return (
            <Form onSubmit={this.onSubmit.bind(this)}>

                <Title>{this.title}</Title>

                <FieldSet label="Front Blog"
                          error={this.state.errors.front}>
                    <Select value={this.state.values.front}
                            onChange={value => { this.updateValue('front', value || null)}}>
                        {this.state.blogList.map(c => <Option key={c._id} value={c._id}>{c.title}</Option>)}
                    </Select>
                </FieldSet>

                <ButtonList>
                    <SubmitButton>Update</SubmitButton>
                </ButtonList>

            </Form>
        );
    }

    onSubmit(event) {
        event.preventDefault();

        ViewActionCreator.requestUpdateSetting({
            token: this.token,
            data: this.state.values
        });
    }

    onSettingStoreChanged() {
        var action = SettingStore.latestAction;

        this.setCurrentValues();

        if (action && action.token === this.token) {
            if (action.data && action.data.errors) {
                this.setState(s => {
                    s.errors = action.data.errors
                });
            } else {
                console.log("Hmm, やったぁ！");
                //this.context.history.pushState(null, "/admin/users");
            }
        }
    }

    updateValue(fieldName, value) {
        this.setState(s => {
            s.values[fieldName] = value;
        });
    }

    setCurrentValues() {
        this.setState(s => {
            s.values = SettingStore.get();
        });
    }

    setLists() {
        this.setState(s => {
            s.blogList = BlogStore.getAll();
        });
    }

    get title() {
        return "Edit the Setting";
    }

    static get propTypes() {
        return {
            params: React.PropTypes.object
        };
    }

}


export default SettingEditor;
