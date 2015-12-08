import Field from './abstract-field';

class Input extends Field {
}

Input.defaultProps = Object.assign({}, Field.defaultProps, {
    elementName: "input",
    type: "text",
    className: "module-field-text"
});

export default Input;
