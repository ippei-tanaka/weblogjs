import React from 'react';
import UserStore from '../../../../stores/user-store';
import UserActions from '../../../../actions/user-actions';
import Page from '../../../abstructs/page';
import Deleter from '../../../partials/deleter';


class UserDeleter extends Page {

    constructor(props) {
        super(props);

        this.state = {
            label: ""
        };

        this.token = this.generateToken();
        this.deleteSuccessCallback = this.onDeleteSuccess.bind(this);
        this.deleteFailCallback = this.onDeleteFail.bind(this);
    }

    componentWillMount() {
        this.updateLabel();
    }

    componentDidMount() {
        UserStore.addDeleteSuccessEventListener(this.deleteSuccessCallback);
        UserStore.addDeleteFailEventListener(this.deleteFailCallback);
    }

    componentWillUnmount() {
        UserStore.removeDeleteSuccessEventListener(this.deleteSuccessCallback);
        UserStore.removeDeleteFailEventListener(this.deleteFailCallback);
    }

    render() {
        this.setPageTitle(this.title);

        return (
            <Deleter title={this.title}
                     label={this.state.label}
                     onApproved={this.onApproved.bind(this)}
                     onCanceled={this.goToListPage.bind(this)}/>
        );
    }

    onApproved () {
        UserActions.del({
            id: this.props.params.id,
            token: this.token
        })
    }

    onDeleteSuccess(action) {
        if (action.token === this.token) {
            this.setState(s => { s.errors = {} });
            this.goToListPage();
        }
    }

    onDeleteFail(action, errors) {
        if (action.token === this.token) {
            this.setState(s => { s.errors = errors });
        }
    }

    goToListPage() {
        this.context.history.pushState(null, "/admin/users");
    }

    updateLabel() {
        /*
        ServerFacade
            .getUser(this.props.params.id)
            .then(user => {
                return user.display_name;
            })
            .then(values => this.setState({label: values}))
            .catch(data => console.error(data));
            */
    }

    get title() {
        return "Delete User";
    }
}


export default UserDeleter;