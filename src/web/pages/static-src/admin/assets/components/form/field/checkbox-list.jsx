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

    createCheckBox (childProps, index) {
        childProps = Object.assign({}, childProps);
        childProps.onChange = this.onCheckboxChanged.bind(this);

        if (index === 0) {
            childProps.id = this.props.id;
            childProps.autoFocus = this.props.autoFocus;
        } else {
            childProps.id = null;
            childProps.autoFocus = false;
        }

        childProps.value = this.props.value ? this.props.value.indexOf(childProps.name) !== -1 : false;

        return React.createElement(Checkbox, childProps);
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
    className: "module-checkbox-list",
    value: false,
    autoFocus: false,
    onChange: function () {}
};


export default CheckboxList;
