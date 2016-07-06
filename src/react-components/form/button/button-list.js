import React from 'react';

const ButtonList = ({children}) => (
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
);

export default ButtonList;
