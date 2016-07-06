import React from 'react';

const Button = ({onClick, children}) => (
    <button className="module-button"
            onClick={onClick}
            type="button">
        {children}
    </button>
);

export default Button;