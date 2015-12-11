import React from 'react';


class Textarea extends React.Component {

    render() {
        return <textarea id={this.props.id}
                         value={this.props.value}
                         className={this.props.className}
                         onChange={this.wrapOnChange.call(this, this.props.onChange)}/>;
    }

    wrapOnChange(onChange) {
        return (e) => {
            onChange(e.target.value);
        };
    }

}


Textarea.defaultProps = {
    id: "",
    className: "module-textarea",
    value: "",
    onChange: function () {
    }
};


export default Textarea;