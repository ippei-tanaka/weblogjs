import React from 'react';

const Form = ({
    onSubmit = () => {},
    children
    }) => (
    <form className="module-data-editor"
          onSubmit={onSubmit}>
        {children}
    </form>
);

export default Form;