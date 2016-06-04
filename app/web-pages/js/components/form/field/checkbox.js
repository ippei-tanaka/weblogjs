import React from 'react';


const Checkbox = ({
    id = null,
    name = null,
    label = null,
    value = false,
    className = "module-checkbox",
    autoFocus = false,
    onChange = () => {}
    }) => (
    <label>
        <input
            id={id}
            type="checkbox"
            name={name}
            checked={value}
            autoFocus={autoFocus}
            className={className}
            onChange={onChange}
        />
        {label && <span>{label}</span>}
    </label>
);

export default Checkbox;
