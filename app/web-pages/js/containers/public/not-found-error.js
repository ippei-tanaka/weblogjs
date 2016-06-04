import React, { Component } from 'react';
import actions from '../../actions';
import { connect } from 'react-redux';
import co from 'co';
import { Link } from 'react-router';
import PublicPost from '../../components/public-post';
import PublicCategoryList from '../../components/public-category-list';
import { NOT_FOUND } from '../../../router/lib/status-codes';

class NotFoundError extends Component {

    static prepareForPreRendering({actions, store}) {
        return Promise.resolve({ statusCode: NOT_FOUND });
    }

    render() {
        return (
            <section className="module-section">
                Page Not Found.
            </section>
        );
    }
}

export default connect(
    null,
    null
)(NotFoundError);