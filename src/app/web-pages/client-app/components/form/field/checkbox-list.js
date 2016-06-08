import React from 'react';
import ReactDom from 'react-dom';
import Checkbox from './checkbox';

const CheckboxList = ({
    id = null,
    className = "module-checkbox-list",
    value = false,
    autoFocus = false,
    onChange = () => {},
    children
    }) => (
    <ul className={className}>
        {React.Children.map(children,
            (child, index) => {
                if (child.type !== Checkbox) throw new Error("Each child has to be Checkbox.");

                const boxValue = Array.isArray(value) && value.length > 0 ? value.indexOf(child.props.name) !== -1 : false;
                const additionalProps = index === 0 ? {id, value: boxValue, autoFocus} : {value: boxValue};
                const props = Object.assign({}, child.props, additionalProps);

                return (
                    <li key={index}>
                        <Checkbox {...props} />
                    </li>
                );
            })}
    </ul>
);

export default CheckboxList;
