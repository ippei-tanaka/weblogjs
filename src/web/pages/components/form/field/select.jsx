import React from 'react';
import ReactDom from 'react-dom';
import Option from './option';


class Select extends React.Component {

    render() {
        return (
            <select id={this.props.id}
                    className={this.props.className}
                    value={this.props.value}
                    autoFocus={this.props.autoFocus}
                    onChange={this.onSelectChanged.bind(this)}>

                {this.props.empty ? <Option key="null" value="">---- select ----</Option> : null}

                {React.Children.map(this.props.children,
                    child => {
                        if (child.type !== Option) throw new Error("Each child has to be Option.");
                        return child;
                        })}

            </select>
        );
    }

    onSelectChanged(e) {
        this.props.onChange(e.target.value);
    }

}


Select.defaultProps = {
    id: null,
    className: "module-select",
    value: null,
    autoFocus: false,
    empty: true,
    onChange: function () {
    }
};


export default Select;
