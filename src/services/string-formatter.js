/**
 * @param {string} str
 * @returns {string}
 */
var dasherize = (str) => {
    return str.replace(/[A-Z]/g, (char, index) => {
        return (index !== 0 ? '-' : '') + char.toLowerCase();
    }).replace(/[ ]/g, "");
};

module.exports = {
    dasherize
};