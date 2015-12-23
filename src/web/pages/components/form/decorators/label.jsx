import React from 'react';


var Label = ({htmlFor, children}) => (
    <label className="module-field-label"
           htmlFor={htmlFor}>
        {children}
    </label>
);

Label.defaultProps = {
    htmlFor: null
};


export default Label;
