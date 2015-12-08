import React from 'react';
import ReactDom from 'react-dom';
import Checkbox from './checkbox';


class CheckboxList extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <ul className={this.props.className}>
                {React.Children.map(this.props.children,
                    (child, index) => {
                        if (child.type !== Checkbox) throw new Error("Each child has to be Checkbox.");
                        var checkbox = this.createCheckBox(child.props);
                        return <li key={index}>{checkbox}</li>
                    })}
            </ul>
        );
    }

    createCheckBox (props) {
        props = Object.assign({}, props);
        props.onChange = this.onCheckboxChanged.bind(this);
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
    className: "module-checkbox-list",
    onChange: function () {}
};


export default CheckboxList;
