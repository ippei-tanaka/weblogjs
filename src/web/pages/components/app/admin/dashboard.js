import React from 'react';
import ServerFacade from '../../../services/server-facade';


class Dashboard extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            myName: ""
        };
    }

    componentWillMount () {
        ServerFacade.getMe().then((me) => {
            this.setState({
                myName: me.display_name
            });
        });
    }

    render() {
        return (
            <div className="module-dashboard">
                <p>Today, {this.state.myName} will feel {Math.random() > 0.5 ? "lucky!" : "unlucky..."}</p>
                <p><a href="/" target="_black">Public Page</a></p>
            </div>
        );
    }

}


export default Dashboard;
