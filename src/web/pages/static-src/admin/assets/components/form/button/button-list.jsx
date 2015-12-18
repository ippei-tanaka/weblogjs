import React from 'react';
import Button from './button';
import SubmitButton from './submit-button';


export default function ButtonList ({children}) {
    return (
        <div className="m-dte-field-container">
            <ul className="m-dte-button-list">
                {React.Children.map(children, child => {

                    if (child.type !== Button
                        && child.type !== SubmitButton)
                        throw new Error("Each cild has to be Button.");

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
