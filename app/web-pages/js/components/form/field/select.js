import React from 'react';
import ReactDom from 'react-dom';
import Option from './option';

const onSelectChanged = (onChange) => {
    return (e) => {
        onChange(e.target.value);
    };
};

const Select = ({
    id = null,
    className = "module-select",
    value = "",
    autoFocus = false,
    empty = true,
    onChange = () => {},
    children
    }) => (
    <select id={id}
            className={className}
            value={value}
            autoFocus={autoFocus}
            onChange={onSelectChanged(onChange)}>

        {empty && <Option key="null" value="">---- select ----</Option>}

        {React.Children.map(children, (child) => {
            if (child.type !== Option) throw new Error("Each child has to be Option.");
            return child;
        })}

    </select>
);


export default Select;
