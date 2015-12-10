import React from 'react';
import Confirmation from './confirmation';


class Deleter extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            label: ""
        };
    }

    componentWillMount() {
        this.retrieveLabel(this.props.id)
            .then((values) => this.setState({label: values}))
            .catch(data => console.error(data));
    }

    render() {
        return (
            <div className="module-data-editor">
                <h2 className="m-dte-title">{this.title}</h2>
                <Confirmation
                    mode="choose"
                    onApproved={this.onDeleteApproved.bind(this)}
                    onCanceled={this.onDeleteCanceled.bind(this)}
                >
                    Do you want to delete "{this.state.label}"?
                </Confirmation>
            </div>
        );
    }

    retrieveLabel(id) {
        return Promise.reject("Implement retrieveLabel(id).");
    }

    get title() {
        return "Delete Something";
    }

    onDeleteApproved() {
        this.deleteModel(this.props.id)
            .then(() => this.props.onComplete())
            .catch(data => console.error(data));
    }

    onDeleteCanceled() {
        this.props.onComplete();
    }

    deleteModel(id) {
        return Promise.reject("Implement deleteUser(id).");
    }

}

Deleter.defaultProps = {
    id: "",
    onComplete: function () {
    }
};

export default Deleter;