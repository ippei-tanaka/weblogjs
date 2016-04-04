import ModelManager from "./model-manager";
import User from "./models/user";
import Privileges from './models/privileges';
import ConfigManager from '../config-manager';
import Errors from '../../lib/errors';
import co from 'co';


var config = ConfigManager.load();


class UserManager extends ModelManager {

    constructor() {
        super(User);
    }

    findByEmail(email) {
        return this.findOne({email: email});
    }

    findBySlug(slug) {
        return this.findOne({slug: slug});
    }

    /*

    update(condition, newValues) {
        return super.update(condition, newValues).catch(function (e) {
            console.log(3333);
            console.log(e);
        });
    }


    update(condition, newValues) {
        if (newValues.password) {
            delete newValues.password;
        }
        return super.update(condition, newValues);
    }

    updatePassword(id, values) {
        const {
            new_password,
            new_password_confirmed,
            old_password
            } = values;

        return co(function* () {

            console.log('qweqweqeqweqw');

            if (!old_password
                || !new_password
                || !new_password_confirmed)
            {
                return yield Promise.reject({});
            }

            console.log('zEEEEghfhfghfgh');

            if (new_password !== new_password_confirmed)
            {
                return yield Promise.reject({});
            }

            const options = {select: ["password"]};
            const user = yield this.findById(id, options);

            if (!user) {
                return yield Promise.reject({});
            }


            if (!(yield user.verifyPassword(old_password))) {
                return yield Promise.reject({});
            }

            user.password = new_password;

            yield user.save();

            return yield Promise.resolve({});
        }.bind(this));
    }
    */

    /**
     * @param {object} credential - Credential of the user.
     * @param {string} credential.email - The email of the user.
     * @param {string} credential.password - The password of the user.
     * @returns {Promise}
     */
    isValid(credential) {

        var condition = {email: credential.email};
        var options = {select: ["password"]};

        return co(function* () {
            let user = yield this.findOne(condition, options);

            if (!user) {
                return false;
            }

            return user.verifyPassword(credential.password);
        }.bind(this));
    }

    createAdminUser(userObject) {
        userObject = userObject || {
                email: config.admin_email,
                password: config.admin_password,
                display_name: "Admin",
                slug: "admin"
            };

        return this.create({
            email: userObject.email,
            password: userObject.password,
            display_name: userObject.display_name,
            slug: userObject.slug,
            privileges: [Privileges.READ, Privileges.EDIT, Privileges.CREATE, Privileges.GRANTED]
        });
    }

    createRegularUser(userObject) {
        return this.create({
            email: userObject.email,
            display_name: userObject.display_name,
            slug: userObject.slug,
            password: userObject.password,
            privileges: [Privileges.READ, Privileges.EDIT, Privileges.CREATE]
        })
    }
}

export default new UserManager();