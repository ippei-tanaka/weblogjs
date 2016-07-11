import React, { Component } from 'react';
import { connect } from 'react-redux';
import { NOT_FOUND } from '../../constants/status-codes';

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