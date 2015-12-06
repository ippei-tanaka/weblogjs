class StringFormatter {

    constructor(str) {
        this._str = str;
    }

    slugfy() {
        this._str = this.constructor.slugfy(this._str);
        return this;
    }

    toString() {
        return this._str.toString();
    }

    static slugfy(str) {
        return str
            .replace(/[^A-Za-z0-9 !@%\*\-_]/g, "")
            .replace(/[ ]+/g, " ")
            .trim()
            .replace(/[ ]/g, "-")
            .toLowerCase();
    }

}

export let slugfy = StringFormatter.slugfy;

export default StringFormatter;
