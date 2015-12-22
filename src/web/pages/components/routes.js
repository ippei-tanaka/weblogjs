import React from "react";
import ReactDOM from "react-dom";
import { Route, Link } from 'react-router'

class App extends React.Component {

    render () {
        return <div>
            App<br />
            <Link to="/admin/test">Test</Link>
            {this.props.children}
        </div>
    }

}

class Test extends React.Component {

    render () {
        return <div>Test</div>
    }

}

class NoMatch extends React.Component {

    render () {
        return <div>NoMatch</div>
    }

}

export default (
    <Route path="/" component={App}>
        <Route path="admin" component={Test}>
            <Route path="test" component={Test}/>
        </Route>
        <Route path="*" component={NoMatch}/>
    </Route>
);