import React from 'react';
import ReactDom from 'react-dom';
import Option from './option';


class Select extends React.Component {

    render() {
        return (
            <select className={this.props.className}
                    id={this.props.id}
                    value={this.props.value}
                    autoFocus={this.props.autoFocus}
                    onChange={this.onSelectChanged.bind(this)}>

                {React.Children.map(this.props.children,
                    child => {
                        if (child.type !== Option) throw new Error("Each child has to be Option.");
                        return child;
                        })}

            </select>
        );
    }

    onSelectChanged (e) {
        this.props.onChange(e.target.value);
    }

}


Select.defaultProps = {
    id: "",
    className: "module-select",
    value: null,
    autoFocus: false,
    onChange: function () {}
};


export default Select;
