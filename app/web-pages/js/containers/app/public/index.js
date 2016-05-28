import React, { Component } from 'react';
import actions from '../../../actions';
import { connect } from 'react-redux';
import co from 'co';

class Public extends Component {

    static fetchData ({actions, store}) {
        return co(function* () {
            yield actions.loadUsers();
        }.bind(this));
    }

    static getTitle ({actions, store}) {
        const name = store.getState().user.toArray()[0].display_name;
        return `Hey, I am ${name}!`;
    }

    constructor(props) {
        super(props);
    }

    componentDidMount() {

    }

    render() {

        const users = this.props.userStore.toArray();

        return (
            <div>
                Public Page
                {
                    users.map(user => <div>{user.display_name}</div>)
                }
            </div>
        );
    }
}

export default connect(
    state => ({userStore: state.user}),
    actions
)(Public);