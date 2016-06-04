import React from 'react';

const wrapOnChange = (onChange) => {
    return (e) => {
        onChange(e.target.value);
    };
};

const Textarea = ({
    id = null,
    className = "module-textarea",
    value = "",
    autoFocus = false,
    onChange = () => {}
    }) => (
    <textarea id={id}
              value={value}
              className={className}
              autoFocus={autoFocus}
              onChange={wrapOnChange(onChange)}/>
);

export default Textarea;