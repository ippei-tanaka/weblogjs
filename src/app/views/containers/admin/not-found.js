import React, { Component } from 'react';
import actions from '../../actions';
import { connect } from 'react-redux';
import co from 'co';
import { Link } from 'react-router';

class NotFound extends Component {
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
)(NotFound);