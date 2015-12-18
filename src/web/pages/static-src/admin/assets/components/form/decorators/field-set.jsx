import React from 'react';
import ErrorMessage from './error-message';
import Label from './label';


export default function FieldSet({id, label, error, children}) {
    return (
        <div className="m-dte-field-container">
            <Label htmlFor={id}>
                {label}
            </Label>
            {children}
            <ErrorMessage error={error}/>
        </div>
    )
};