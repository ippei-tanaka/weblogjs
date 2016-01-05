import React from 'react';


export default function ButtonList ({children}) {
    return (
        <div className="m-dte-field-container">
            <ul className="m-dte-button-list">
                {React.Children.map(children, child => {
                    return (
                    <li className="m-dte-button-list-item">
                        {child}
                    </li>
                        );
                    })}
            </ul>
        </div>
    )
};
