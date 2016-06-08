import React from 'react';


const Option = ({
    value = null,
    children
    }) => (
    <option value={value}>{children}</option>
);

export default Option;