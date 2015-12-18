import React from 'react';


class Textarea extends React.Component {

    render() {
        return <textarea id={this.props.id}
                         value={this.props.value}
                         className={this.props.className}
                         autoFocus={this.props.autoFocus}
                         onChange={this.wrapOnChange.call(this, this.props.onChange)}/>;
    }

    wrapOnChange(onChange) {
        return (e) => {
            onChange(e.target.value);
        };
    }

}


Textarea.defaultProps = {
    id: null,
    className: "module-textarea",
    value: null,
    autoFocus: false,
    onChange: function () {
    }
};


export default Textarea;