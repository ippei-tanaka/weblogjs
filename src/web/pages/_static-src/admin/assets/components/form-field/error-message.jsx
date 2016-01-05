import React from 'react';

export default class extends React.Component {

    render () {
        return (
            this.props.error ? (
                <span className="module-field-error-message">
                    {this.props.error.message}
                </span>
            ) : null
        );
    }

    static get defaultProps() {
        return {
            error: null
        }
    }

}