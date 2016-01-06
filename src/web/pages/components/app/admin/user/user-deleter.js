import React from 'react';
import ServerFacade from '../../../../services/server-facade';
///import UserStore from '../../../../stores/user-store';
import Page from '../../../abstructs/page';
import Deleter from '../../../partials/deleter';


class UserDeleter extends Page {

    constructor(props) {
        super(props);
        this.state = {
            label: ""
        };
    }

    componentWillMount() {
        this.updateLabel();
    }

    render() {
        return (
            <Deleter title={this.title}
                     label={this.state.label}
                     onApproved={() => this.deleteModel()}
                     onCanceled={() => this.goToListPage()}/>
        );
    }

    updateLabel() {
        ServerFacade
            .getUser(this.props.params.id)
            .then(user => {
                return user.display_name;
            })
            .then((values) => this.setState({label: values}))
            .catch(data => console.error(data));
    }

    deleteModel() {
        ServerFacade
            .deleteUser(this.props.params.id)
            .then(() => this.goToListPage());
    }

    goToListPage() {
        this.context.history.pushState(null, "/admin/users");
    }

    get title() {
        return "Delete User";
    }
}


export default UserDeleter;