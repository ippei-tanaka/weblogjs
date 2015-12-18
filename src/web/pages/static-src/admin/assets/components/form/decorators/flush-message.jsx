import React from 'react';

export default class FlushMessage extends React.Component {

    render () {
        return this.props.children ? (
            <div className="m-dte-field-container">
                <div className="m-dte-flush-message">
                    {this.props.children}
                </div>
            </div>
        ) : null;
    }

}