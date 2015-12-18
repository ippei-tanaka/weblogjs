export let trimObjValues = (obj) => {
    var _obj = Object.assign({}, obj);

    for (let key of Object.keys(_obj)) {
        let value = _obj[key];
        if (typeof value === "string") {
            _obj[key] = value.trim();
        }
    }

    return _obj;
};

export let slugfy = str => str
    .replace(/[^A-Za-z0-9 !@%\*\-_]/g, "")
    .replace(/[ ]+/g, " ")
    .trim()
    .replace(/[ ]/g, "-")
    .toLowerCase();