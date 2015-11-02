"use strict";

/**
 * @param {mongoose.Schema} schema
 * @param {object} [options]
 * @param {string} [options.separator]
 */
var slugPlugin = (schema, options) => {

    options = options || {};

    var separator = options.separator ? String(options.separator) : "-";

    // Array of names of paths that have 'slug' option and paths that slug will be generated based on.
    var pathArray = Object.keys(schema.paths)
            .filter((pathName) => {
                var path = schema.paths[pathName];
                var options = path.options;
                return options && options.slug && path.instance === "String";
            })
            .map((pathName) => {
                return {
                    slugPath : pathName,
                    originalPath: schema.paths[pathName].options.slug
                };
            });


    schema.pre('validate', function (next) {
        var currentDoc = this;

        pathArray.forEach(((obj) => {

            var slugPath = obj.slugPath;
            var originalPath = obj.originalPath;
            var slugBase;
            var condition;

            if (!currentDoc[slugPath]) {
                currentDoc[slugPath] = slugfy(currentDoc[originalPath]);
            }

            slugBase = parseSlugBase(separator, currentDoc[slugPath]);

            condition = {
                [slugPath]: new RegExp(`^${slugBase}(${separator}[1-9][0-9]*)?$`)
            };

            currentDoc.constructor
                .find(condition)
                .exec()
                .then(function (_docs) {

                    var slugNameWithBiggestNum,
                        currentSlugNumber,
                        newSlugNumber;

                    if (_docs.length === 0) {
                        next();
                        return;
                    }

                    if (_docs.length > 1) {
                        _docs.sort(sortDocsBySlugNumber(separator, slugPath));
                    }

                    slugNameWithBiggestNum = _docs[_docs.length - 1][slugPath];

                    currentSlugNumber = parseSlugNumber(separator, slugNameWithBiggestNum);

                    newSlugNumber = currentSlugNumber < 2 ? 2 : currentSlugNumber + 1;

                    currentDoc[slugPath] = slugBase + separator + newSlugNumber;

                    next();
                });
        }));
    })
};


/**
 * @param {string} str
 * @returns {string}
 */
var slugfy = (str) => {
    return str
        .replace(/[^A-Za-z0-9 ]/g, "")
        .replace(/[ ]+/g, " ")
        .trim()
        .replace(/[ ]/g, "-")
        .toLowerCase();
};


/**
 * @param separator {string}
 * @param pathName {string}
 * @returns {function}
 */
var sortDocsBySlugNumber = (separator, pathName) => {
    return (doc1, doc2) => {
        if (parseSlugNumber(separator, doc1[pathName]) > parseSlugNumber(separator, doc2[pathName])) {
            return 1;
        }
        if (parseSlugNumber(separator, doc1[pathName]) < parseSlugNumber(separator, doc2[pathName])) {
            return -1;
        }
        return 0;
    };
};


/**
 * @param separator {string}
 * @param str {string}
 * @returns {number}
 */
var parseSlugNumber = (separator, str) => {
    str.match(new RegExp(`^(.+)${separator}([1-9][0-9]*)$`));
    return RegExp.$2 ? Number.parseInt(RegExp.$2) : 0;
};



/**
 * @param separator {string}
 * @param str {string}
 * @returns {string}
 */
var parseSlugBase = (separator, str) => {
    var suffix;

    str.match(new RegExp(`(${separator}[1-9][0-9]*)$`));

    suffix = RegExp.$1;

    return suffix === ""
        ? str
        : str.replace(new RegExp(`${suffix}$`), "");
};


module.exports = slugPlugin;