import React, { Component } from 'react';
import Confirmation from '../../../react-components/confirmation';
import actions from '../../actions';
import { connect } from 'react-redux';
import { RESOLVED } from '../../constants/transaction-status';
import { ADMIN_DIR } from '../../constants/config'

class PostDeleter extends Component {

    constructor(props) {
        super(props);

        this.state = {
            actionId: null
        }
    }

    componentDidMount() {
        this.setState({actionId: Symbol()});
        this.props.loadPosts();
    }

    componentWillUnmount() {
        this.props.finishTransaction(this.state.actionId);
    }

    componentWillReceiveProps(props) {
        const transaction = props.transactionStore.get(this.state.actionId);

        if (transaction && transaction.get('status') === RESOLVED) {
            this._goToListPage();
        }
    }

    render() {
        const { params : {id}, postStore } = this.props;

        const deletedPost = postStore.get(id) || null;

        return deletedPost ? (
            <div className="module-data-editor">
                <h2 className="m-dte-title">{`Delete the Post "${deletedPost.title}"`}</h2>
                <Confirmation
                    mode="choose"
                    onApproved={this._onApproved.bind(this)}
                    onCanceled={this._goToListPage.bind(this)}
                >{`Do you want to delete "${deletedPost.title}"?`}</Confirmation>
            </div>
        ) : (
            <div className="module-data-editor">
                <h2 className="m-dte-title">The post doesn't exist.</h2>
            </div>
        );
    }

    _onApproved () {
        const { params : {id}, deletePost } = this.props;
        deletePost(this.state.actionId, {id});
    }

    _goToListPage() {
        this.context.router.push(`${ADMIN_DIR}/posts`);
    }

    static get contextTypes() {
        return {
            router: React.PropTypes.object.isRequired
        };
    }

    static get propTypes() {
        return {
            params: React.PropTypes.object.isRequired
        };
    }

}

export default connect(
    state => ({
        postStore: state.post,
        transactionStore: state.transaction
    }),
    actions
)(PostDeleter);