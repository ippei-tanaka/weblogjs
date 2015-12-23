import React from 'react';


export default function SubmitButton({onClick, children}) {
    return (
        <button className="module-button"
                onClick={onClick}
                type="submit">
            {children}
        </button>
    )
};