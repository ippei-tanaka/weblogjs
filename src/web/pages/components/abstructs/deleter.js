import React from 'react';
import Confirmation from '../partials/confirmation';
import { FlushMessage } from '../form';
import Page from './page';


class Deleter extends Page {

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
        this.setPageTitle(this.pageTitle);

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

    buildSuccessLocation(id) {
    }

    buildCancelLocation(id) {
    }

    get title() {
        throw new Error("Implement get title()");
    }

    get pageTitle() {
        throw new Error("Implement get pageTitle()");
    }

    onDeleteApproved() {
        this.deleteModel(this.props.params.id)
            .then(() => {
                this.context.history.pushState(null, this.buildSuccessLocation(this.props.params.id));
            })
            .catch(data => console.error(data));
    }

    onDeleteCanceled() {
        this.context.history.pushState(null, this.buildCancelLocation(this.props.params.id));
    }

    deleteModel(id) {
        return Promise.reject("Implement deleteUser(id).");
    }

    static get propTypes() {
        return {
            params: React.PropTypes.object
        };
    }

}


export default Deleter;