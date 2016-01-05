export let override = function (target, property, descriptor) {

    var Class = target;
    var hasSuperClass = false;

    while (Class) {
        Class = Object.getPrototypeOf(Class);

        if (Class && Class.hasOwnProperty(property)) {
            hasSuperClass = true;
            break;
        }
    }

    if (!hasSuperClass) {
        let propertyName = property;

        if (descriptor.get) {
            propertyName = "get " + propertyName;
        }

        if (descriptor.set) {
            propertyName = "set " + propertyName;
        }

        throw new TypeError(`"${propertyName}" doesn't exist on super classes.`);
    }

    if (typeof (target[property]) === "function") {
        if (target[property].length !== Class[property].length) {
            throw new TypeError(`The number of arguments of "${property}" is different from its super class's.`);
        }
    }
};