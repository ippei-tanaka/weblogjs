import React from 'react';

const wrapOnChange = (onChange) => {
    return (e) => {
        onChange(e.target.value);
    };
};

const Input = ({
    id = null,
    type = "text",
    className = "module-field-text",
    value = "",
    autoFocus = false,
    onChange = () => {}
    }) => (
    <input id={id}
           type={type}
           value={value}
           className={className}
           autoFocus={autoFocus}
           onChange={wrapOnChange(onChange)}/>
);

export default Input;
