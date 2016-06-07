import React from 'react';
import ErrorMessage from './error-message';
import Label from './label';

const FieldSet = ({id, label, error, children}) => (
    <div className="m-dte-field-container">
        <Label htmlFor={id}>
            {label}
        </Label>
        {children}
        <ErrorMessage error={error}/>
    </div>
);

export default FieldSet;