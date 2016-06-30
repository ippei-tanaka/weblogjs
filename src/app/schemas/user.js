import co from 'co';
import validator from 'validator';
import { generateHash, compareHashedStrings } from '../utils';
import { MongoSchema, types, eventHub } from '../../../../simple-odm';

const paths = {

    email: {
        unique: true,
        required: true,
        type: types.String,
        sanitize: (value) => validator.normalizeEmail(value),
        validate: function* (value)
        {
            if (!validator.isEmail(value))
            {
                yield `A ${this.name} should be a valid email.`;
            }
        }
    },

    password: {
        required: ['created'],
        type: types.String,
        projected: false,
        validate: function* (value)
        {
            const range = {min: 8, max: 16};
            if (!validator.isLength(value, range))
            {
                yield `A ${this.name} should be between ${range.min} and ${range.max} characters.`;
            }

            if (!validator.matches(value, /^[a-zA-Z0-9#!@%&\*]*$/))
            {
                yield `Only alphabets, numbers and some symbols (#, !, @, %, &, *) are allowed for a ${this.name}.`;
            }
        }
    },

    display_name: {
        display_name: "display name",
        required: true,
        type: types.String,
        sanitize: (value) => value.trim(),
        validate: function* (value)
        {
            const range = {min: 1, max: 20};
            if (!validator.isLength(value, range))
            {
                yield `A ${this.name} should be between ${range.min} and ${range.max} characters.`;
            }

            if (!validator.matches(value, /^[a-zA-Z0-9_\-#!@%&\* ]*$/))
            {
                yield `Only alphabets, numbers, spaces and some symbols (_, -, #, !, @, %, &, *) are allowed for a ${this.name}.`;
            }
        }
    },

    slug: {
        unique: true,
        required: true,
        type: types.String,
        sanitize: (value) => value.trim(),
        validate: function* (value)
        {
            const range = {min: 1, max: 200};
            if (!validator.isLength(value, range))
            {
                yield `A ${this.name} should be between ${range.min} and ${range.max} characters.`;
            }

            if (!validator.matches(value, /^[a-zA-Z0-9\-_]*$/))
            {
                yield `Only alphabets, numbers and some symbols (-, _) are allowed for a ${this.name}.`;
            }
        }
    }
};

const HASHED_PASSWORD = "hashed_password";
const OLD_PASSWORD = "old_password";
const PASSWORD_UPDATE = "password_update";
const PASSWORD = "password";
const PASSWORD_CONFIRMED = "password_confirmed";

class UserSchema extends MongoSchema {

    /**
     * @override
     */
    constructor ()
    {
        super({name: 'user', paths});
    }

    /*
    _preCreate(arg) {
        const superFunc = super._preCreate.bind(this);

        return co(function* () {
            const { values, errorMap } = deepcopy(yield superFunc(arg));

            const {rawValues} = arg;

            if (!errorMap[PASSWORD]
                || !Array.isArray(errorMap[PASSWORD])
                || errorMap[PASSWORD].length === 0)
            {
                values[HASHED_PASSWORD] = yield generateHash(rawValues[PASSWORD]);
            }

            delete values[PASSWORD];

            return {values, errorMap};
        });
    }

    _preUpdate(arg) {
        const superFunc = super._preUpdate.bind(this);

        return co(function* () {
            const { values, errorMap } = deepcopy(yield superFunc(arg));
            const {rawInitialValues, rawUpdatedValues} = arg;

            if (rawUpdatedValues[PASSWORD_UPDATE]) {
                if (!rawUpdatedValues.hasOwnProperty(PASSWORD) || !rawUpdatedValues[PASSWORD]) {
                    errorMap[PASSWORD] = ["The new password is required."];
                }

                if (!rawUpdatedValues.hasOwnProperty(OLD_PASSWORD) || !rawUpdatedValues[OLD_PASSWORD]) {
                    errorMap[OLD_PASSWORD] = ["The current password is required."];
                }

                if (!rawUpdatedValues.hasOwnProperty(PASSWORD_CONFIRMED) || !rawUpdatedValues[PASSWORD_CONFIRMED]) {
                    errorMap[PASSWORD_CONFIRMED] = ["The confirmed password is required."];
                }

                if (rawUpdatedValues.hasOwnProperty(PASSWORD_CONFIRMED)
                    && rawUpdatedValues[PASSWORD_CONFIRMED] !== ""
                    && rawUpdatedValues[PASSWORD] !== rawUpdatedValues[PASSWORD_CONFIRMED]) {
                    errorMap[PASSWORD_CONFIRMED] = ['The confirmed password sent is not the same as the new password.'];
                }

                if (rawUpdatedValues.hasOwnProperty(OLD_PASSWORD) && rawUpdatedValues[OLD_PASSWORD] !== "") {
                    const result = yield this.compareHashedStrings(rawUpdatedValues[OLD_PASSWORD], rawInitialValues[HASHED_PASSWORD]);
                    if (!result) {
                        errorMap[OLD_PASSWORD] = ["The current password sent is not correct."];
                    }
                }

                if (Object.keys(errorMap).length === 0) {
                    values[HASHED_PASSWORD] = yield generateHash(rawUpdatedValues[PASSWORD]);
                }
            } else {
                if (rawUpdatedValues.hasOwnProperty(PASSWORD)) {
                    errorMap[PASSWORD] = ["The password can't be updated."];
                }
            }

            return { values, errorMap };
        }.bind(this));
    }
    */
}

const schema = new UserSchema();

eventHub.on(schema.BEFORE_SAVED, ({errors, values, initialValues}) =>
{
    if (!values._id)
    {
        return co(function* () {
            const _values = Object.assign({}, values);

            if (!errors[PASSWORD]
                || !Array.isArray(errors[PASSWORD])
                || errors[PASSWORD].length === 0)
            {
                _values[HASHED_PASSWORD] = yield generateHash(values[PASSWORD]);
            }

            delete _values[PASSWORD];

            return {values: _values};
        });
    }
    else
    {
        // The model is updated

        /*
        model.addOverriddenValues({
            email: model.getValues().email + "?",
            age: 20
        });
        */
    }
});

export default schema;