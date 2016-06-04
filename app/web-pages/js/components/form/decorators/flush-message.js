import React from 'react';

const FlushMessage = ({children}) => children && (
    <div className="m-dte-field-container">
        <div className="m-dte-flush-message">
            {children}
        </div>
    </div>
);

export default FlushMessage;