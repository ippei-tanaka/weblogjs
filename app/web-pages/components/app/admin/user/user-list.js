import React from 'react';
import Moment from 'moment';
import List from '../../../partials/list';
import UserStore from '../../../../stores/user-store';
import ViewActionCreator from '../../../../action-creators/view-action-creator';
import Page from '../../../abstructs/page';

class UserList extends Page {

    constructor(props) {
        super(props);

        this.state = {
            models: []
        };

        this.updateModelsCallback = this.updateModels.bind(this);
    }

    componentDidMount() {
        this.updateModels();
        UserStore.addChangeListener(this.updateModelsCallback);
    }

    componentWillUnmount() {
        UserStore.removeChangeListener(this.updateModelsCallback);
    }

    render() {
        this.setPageTitle(this.title);

        return <List title={this.title}
                     adderLocation="/admin/users/adder"
                     fields={this.fields}
                     models={this.state.models}
                     editorLocationBuilder={id => `/admin/users/${id}/editor`}
                     deleterLocationBuilder={id => `/admin/users/${id}/deleter`}/>;
    }

    updateModels() {
        this.setState({models: UserStore.getAll()});
    }

    get fields() {
        return {
            display_name: {
                label: "Name"
            },

            slug: {
                label: "Slug"
            },

            email: {
                label: "Email"
            },

            readable_privileges: {
                label: "Privileges",
                stringify: value =>
                    value.map(p => p.toLowerCase()).join(', ')
            },

            created: {
                label: "Created",
                stringify: value =>
                    Moment(value).format("YYYY-MM-DD HH:mm Z")
            },

            updated: {
                label: "Updated",
                stringify: value =>
                    Moment(value).format("YYYY-MM-DD HH:mm Z")
            }
        }
    }

    get title() {
        return "User List";
    }

}

export default UserList;