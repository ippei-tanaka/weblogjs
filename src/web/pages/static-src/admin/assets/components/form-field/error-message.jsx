import React from 'react';


class ErrorMessage extends React.Component {

    render() {
        return this.props.error ? (
            <span className={this.props.className}>
                {this.props.error.message}
            </span>
        ) : null;
    }

}

ErrorMessage.defaultProps = {
    className: "module-field-error-message"
};


export default ErrorMessage;
