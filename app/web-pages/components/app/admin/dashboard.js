import React from 'react';
import Page from '../../abstructs/page';
import AuthStore from '../../../stores/auth-store';


class Dashboard extends Page {

    constructor(props) {
        super(props);

        this.state = {
            myName: ""
        };

        this.callback = this.updateState.bind(this);
    }

    componentDidMount() {
        this.updateState();
        AuthStore.addChangeListener(this.callback);
    }

    componentWillUnmount() {
        AuthStore.removeChangeListener(this.callback);
    }

    render() {
        this.setPageTitle("Dashboard");

        return (
            <div className="module-dashboard">
                <p>Today, {this.state.myName} will feel {Math.random() > 0.5 ? "lucky!" : "unlucky..."}</p>
                <p><a href="/" target="_black">Public Page</a></p>
            </div>
        );
    }

    updateState () {
        if (AuthStore.isLoggedIn) {
            this.setState(s => {
                s.myName = AuthStore.loginUser.display_name;
            });
        }
    }

}


export default Dashboard;
