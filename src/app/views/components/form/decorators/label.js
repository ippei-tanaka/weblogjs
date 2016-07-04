import React from 'react';


const Label = ({htmlFor = null, children}) => (
    <label className="module-field-label"
           htmlFor={htmlFor}>
        {children}
    </label>
);

export default Label;
