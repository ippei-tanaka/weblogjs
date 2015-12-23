import React from 'react';


export default function Button({onClick, children}) {
    return (
        <button className="module-button"
                onClick={onClick}
                type="button">
            {children}
        </button>
    )
};