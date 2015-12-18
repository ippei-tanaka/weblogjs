export default {
    /**
     * @param fields {Object} - e.g { label: ["string", "number"], value: [] }
     * @returns {Function}
     */
    ArrayOfObjects: function(fields) {
        return (props, propName, componentName) => {

            var prop = props[propName];

            if (!Array.isArray(prop))
                return new Error(`"${propName}" has to be an array!`);

            for (let element of prop) {
                for (let fieldKey of Object.keys(fields)) {
                    if (!element.hasOwnProperty(fieldKey))
                    {
                        return new Error(`An element of "${propName}" has to have "${fieldKey}" property!`);
                    }

                    let typeArray = fields[fieldKey];
                    let type = typeof element[fieldKey];

                    if (typeArray.length > 0 && typeArray.indexOf(type) === -1)
                    {
                        return new Error(`The "${fieldKey}" property of an element in "${propName}" can't be "${type}"!`);
                    }
                }
            }
        }
    }
}