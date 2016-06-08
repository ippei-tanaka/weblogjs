import React from 'react';

const SubmitButton = ({onClick, children}) => (
    <button className="module-button"
            onClick={onClick}
            type="submit">
        {children}
    </button>
);

export default SubmitButton;