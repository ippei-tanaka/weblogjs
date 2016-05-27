import React, { Component } from 'react';
import actions from '../../../actions';
import { connect } from 'react-redux';
import co from 'co';

class Public extends Component {

    /*
    static fetchData ({store}) {
        return co(function* () {
            console.log(12312);
            yield actions.loadUsers("a")(store.dispatch, store.getState);
            console.log(34534);
        }.bind(this)).catch(e => console.log(e));
    }
    */

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