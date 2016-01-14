import React from 'react';
import Confirmation from './confirmation';
import { FlushMessage } from '../form';


class Deleter extends React.Component {

    render() {
        return (
            <div className="module-data-editor">
                <h2 className="m-dte-title">{this.props.title}</h2>
                <Confirmation
                    mode="choose"
                    onApproved={this.props.onApproved}
                    onCanceled={this.props.onCanceled}
                >{this.props.label}</Confirmation>
            </div>
        );
    }

}


export default Deleter;