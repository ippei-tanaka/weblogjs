import React from 'react';

export default class ErrorMessage extends React.Component {

    render () {
        return (
            this.props.error.length > 0 ? (
                <ul>
                    {this.props.error.map((error) =>
                        <li className="module-field-error-message">
                            {error.message}
                        </li>
                    )}
                </ul>
            ) : null
        );
    }

    static get defaultProps() {
        return {
            error: []
        }
    }

}