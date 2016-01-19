import ModelManager from "./model-manager";
import User from "./models/user";
import Privileges from './models/privileges';
import ConfigManager from '../../config-manager';
import Errors from '../errors';
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
                throw new Errors.WeblogJsAuthError();
            }

            let isMatch = user.verifyPassword(credential.password);

            if (!isMatch) {
                throw new Errors.WeblogJsAuthError();
            }

            return this.findById(user.id);
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