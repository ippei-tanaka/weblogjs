import React from 'react';
import Confirmation from '../../partials/confirmation';


class Deleter extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            label: ""
        };
    }

    componentWillMount() {
        this.retrieveLabel(this.props.params.id)
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
        this.deleteModel(this.props.params.id)
            .then(() => this.props.onComplete())
            .catch(data => console.error(data));
    }

    onDeleteCanceled() {
        this.props.onComplete();
    }

    deleteModel(id) {
        return Promise.reject("Implement deleteUser(id).");
    }

    static get defaultProps() {
        return {
            params: null,
            onComplete: () => {}
        }
    }

}


export default Deleter;