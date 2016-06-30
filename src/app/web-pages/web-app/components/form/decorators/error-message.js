import React from 'react';

const ErrorMessage = ({error = []}) => error.length > 0 && (
    <ul>
        {error.map((error, index) =>
            <li className="module-field-error-message" key={index}>
                {error}
            </li>
        )}
    </ul>
);

export default ErrorMessage;