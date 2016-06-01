import React, { Component } from 'react';
import { connect } from 'react-redux';


class Dashboard extends Component {
    render() {
        const { auth } = this.props;
        const user = auth.get('user') || {};

        return (
            <div className="module-dashboard">
                <h1 className="m-dsb-title">Welcome to Weblog Admin Page!</h1>
                <p><a href="/" className="module-button" target="_black"><i className="fa fa-sign-out" /> Public Page</a></p>
            </div>
        );
    }
}

export default connect(
    state => ({auth: state.auth})
)(Dashboard);