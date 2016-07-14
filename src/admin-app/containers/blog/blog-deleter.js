import React, { Component } from 'react';
import Confirmation from '../../../react-components/confirmation';
import actions from '../../actions';
import { connect } from 'react-redux';
import { RESOLVED } from '../../constants/transaction-status';

class BlogDeleter extends Component {

    constructor (props)
    {
        super(props);

        this.state = {
            actionId: null
        }
    }

    componentDidMount ()
    {
        this.setState({actionId: Symbol()});
        this.props.loadBlogs();
    }

    componentWillUnmount ()
    {
        this.props.finishTransaction({actionId: this.state.actionId});
    }

    componentWillReceiveProps (props)
    {
        const transaction = props.transactionStore.get(this.state.actionId);

        if (transaction && transaction.get('status') === RESOLVED)
        {
            this._goToListPage();
        }
    }

    render ()
    {
        const { params : {id}, blogStore } = this.props;

        const deletedBlog = blogStore.get(id) || null;

        return deletedBlog ? (
            <div className="module-data-editor">
                <h2 className="m-dte-title">{`Delete the Blog "${deletedBlog.name}"`}</h2>
                <Confirmation
                    mode="choose"
                    onApproved={this._onApproved.bind(this)}
                    onCanceled={this._goToListPage.bind(this)}
                >{`Do you want to delete "${deletedBlog.name}"?`}</Confirmation>
            </div>
        ) : (
            <div className="module-data-editor">
                <h2 className="m-dte-title">The blog doesn't exist.</h2>
            </div>
        );
    }

    _onApproved ()
    {
        const { params : {id}, deleteBlog } = this.props;
        deleteBlog({
            actionId: this.state.actionId,
            id
        });
    }

    _goToListPage ()
    {
        const root = this.props.adminSiteInfoStore.get("webpageRootForAdmin");
        this.context.router.push(`${root}/blogs`);
    }

    static get contextTypes ()
    {
        return {
            router: React.PropTypes.object.isRequired
        };
    }

    static get propTypes ()
    {
        return {
            params: React.PropTypes.object.isRequired
        };
    }

}

export default connect(
    state => ({
        blogStore: state.blog,
        transactionStore: state.transaction,
        adminSiteInfoStore: state.adminSiteInfo
    }),
    actions
)(BlogDeleter);