import React, { Component } from 'react';
import { connect } from 'react-redux';


class Dashboard extends Component {
    render() {
        const { auth } = this.props;
        const user = auth.get('user') || {};

        return (
            <div className="module-dashboard">
                <p>Today, {user.display_name} will feel {Math.random() > 0.5 ? "lucky!" : "unlucky..."}</p>
                <p><a href="/" target="_black">Public Page</a></p>
            </div>
        );
    }
}

export default connect(
    state => ({auth: state.auth})
)(Dashboard);