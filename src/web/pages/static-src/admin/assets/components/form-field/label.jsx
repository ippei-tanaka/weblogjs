import React from 'react';


class Label extends React.Component {

    render() {
        return (
            <label className={this.props.className}
                   htmlFor={this.props.htmlFor}>
                {this.props.children}
            </label>
        );
    }

}

Label.defaultProps = {
    htmlFor: null,
    className: "module-field-label"
};

export default Label;
