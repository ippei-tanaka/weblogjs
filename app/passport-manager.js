import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import co from 'co';
import UserModel from './models/user-model';
import { ObjectID } from 'mongodb';

let localAuth = passport.authenticate('local');

let instance = null;

class PassportManager {

    constructor () {
        if (instance) {
            return;
        }
        instance = this;

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
            const model = yield UserModel.findOne({email});

            if (!model) {
                return done();
            }

            if (!(yield model.checkPassword(password))) {
                return done();
            }

            return done(null, model.values);

        }.bind(this)).catch(e => console.log);
    }

    _deserializeUser (_id, done) {
        return co(function* () {
            const model = yield UserModel.findOne({_id: new ObjectID(_id)});

            if (!model) {
                return done();
            }

            return done(null, model.values);
        }.bind(this)).catch((error) => {
            done(error);
        });
    }
}

export default new PassportManager();