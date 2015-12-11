import React from 'react';
import ReactDom from 'react-dom';
import Checkbox from './checkbox';


class CheckboxList extends React.Component {

    render() {
        return (
            <ul className={this.props.className}>
                {React.Children.map(this.props.children,
                    (child, index) => {
                        if (child.type !== Checkbox) throw new Error("Each child has to be Checkbox.");
                        var checkbox = this.createCheckBox(child.props, index);
                        return <li key={index}>{checkbox}</li>
                    })}
            </ul>
        );
    }

    createCheckBox (props, index) {
        props = Object.assign({}, props);
        props.onChange = this.onCheckboxChanged.bind(this);

        if (index === 0) {
            props.id = this.props.id;
            props.autoFocus = this.props.autoFocus;
        } else {
            props.id = null;
            props.autoFocus = false;
        }

        return React.createElement(Checkbox, props);
    }

    onCheckboxChanged () {
        var checkboxes = ReactDom.findDOMNode(this).querySelectorAll("input[type='checkbox']");
        var values = [];

        for (let i = 0; i < checkboxes.length; i++) {
            if (checkboxes[i].checked) {
                values.push(checkboxes[i].name);
            }
        }

        this.props.onChange(values);
    }

}


CheckboxList.defaultProps = {
    id: null,
    autoFocus: false,
    className: "module-checkbox-list",
    onChange: function () {}
};


export default CheckboxList;
