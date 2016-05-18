import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import co from 'co';
import ModelOperator from './model/model-operator';

let localAuth = passport.authenticate('local');

let instance = null;

class PassportManager {

    constructor () {
        if (instance) {
            return;
        }
        instance = this;

        this._userOperator = new ModelOperator({schemaName: 'user'});

        passport.use(new LocalStrategy({usernameField: 'email'}, this._authHandler.bind(this)));

        passport.serializeUser((user, done) => {
            done(null, user._id);
        });

        passport.deserializeUser(this._deserializeUser);
    }

    get passport () {
        return passport;
    }

    get localAuth () {
        return localAuth;
    }

    _authHandler (email, password, done) {
        return co(function* () {
            const model = yield this._userOperator.findOne({email});

            console.log("_authHandler");
            console.log(model);

            //var isValid = yield api.userManager.isValid({email: email, password: password});

            /*
            if (isValid) {
                let user = yield api.userManager.findByEmail(email);
                return done(null, user);
            } else {
                return done();
            }
            */

            done();
        }.bind(this)).catch(e => console.log);
    }

    _deserializeUser (_id, done) {
        return co(function* () {
            const model = yield this._userOperator.findOne({_id});
            done(null, model);
            done();
        }.bind(this)).catch((error) => {
            done(error);
        });
    }
}

export default new PassportManager();